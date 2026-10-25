import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { sdk } from "./sdk";
import * as db from "../db";
import { storagePutFile } from "../storage";

const MAX_MEDIA_BYTES = 2 * 1024 * 1024 * 1024;
const CHUNK_SIZE = 8 * 1024 * 1024;

type UploadSession = {
  path: string;
  size: number;
  received: number;
  fileName: string;
  title: string;
  category: string;
  kind: "image" | "video";
  contentType: string;
  openId: string;
  updatedAt: number;
};

const uploadSessions = new Map<string, UploadSession>();

async function getAdminUser(req: express.Request) {
  try {
    const user = await sdk.authenticateRequest(req);
    return user?.role === "admin" ? user : null;
  } catch {
    return null;
  }
}

function safeFileName(fileName: string, kind: "image" | "video") {
  return fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-160) || (kind === "image" ? "image.jpg" : "video.mp4");
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.post("/api/admin/media-upload/start", express.json({ limit: "1mb" }), async (req, res) => {
    const user = await getAdminUser(req);
    if (!user) return res.status(403).json({ error: "Bạn không có quyền upload media" });

    const kind = req.body?.kind === "image" ? "image" : req.body?.kind === "video" ? "video" : null;
    const contentType = text(req.body?.contentType, "");
    const size = Number(req.body?.size);
    if (!kind || !/^(image|video)\//.test(contentType)) return res.status(400).json({ error: "Thiếu loại file ảnh/video hợp lệ" });
    if (!Number.isSafeInteger(size) || size <= 0 || size > MAX_MEDIA_BYTES) return res.status(413).json({ error: "Ảnh hoặc video phải nhỏ hơn hoặc bằng 2 GB" });

    const uploadId = randomUUID();
    const tempPath = path.join(os.tmpdir(), `phan-media-${uploadId}.upload`);
    await fs.writeFile(tempPath, Buffer.alloc(0));
    uploadSessions.set(uploadId, {
      path: tempPath,
      size,
      received: 0,
      fileName: text(req.body?.fileName, kind === "image" ? "image.jpg" : "video.mp4"),
      title: text(req.body?.title, "Tư liệu mới"),
      category: text(req.body?.category, kind === "image" ? "Hình ảnh sự kiện" : "MC sự kiện"),
      kind,
      contentType,
      openId: user.openId,
      updatedAt: Date.now(),
    });
    return res.json({ uploadId, chunkSize: CHUNK_SIZE });
  });

  app.post("/api/admin/media-upload/chunk", express.raw({ type: "application/octet-stream", limit: "12mb" }), async (req, res) => {
    const user = await getAdminUser(req);
    if (!user) return res.status(403).json({ error: "Bạn không có quyền upload media" });

    const uploadId = String(req.headers["x-upload-id"] || "");
    const offset = Number(req.headers["x-offset"]);
    const session = uploadSessions.get(uploadId);
    const body = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    if (!session || session.openId !== user.openId) return res.status(404).json({ error: "Phiên upload không tồn tại" });
    if (!Number.isSafeInteger(offset) || offset < 0) return res.status(400).json({ error: "Offset upload không hợp lệ" });
    if (offset < session.received && offset + body.byteLength <= session.received) return res.json({ nextOffset: session.received });
    if (offset !== session.received) return res.status(409).json({ error: "Chunk không đúng thứ tự", nextOffset: session.received });
    if (!body.byteLength || body.byteLength > CHUNK_SIZE || session.received + body.byteLength > session.size) return res.status(413).json({ error: "Kích thước chunk không hợp lệ" });

    await fs.appendFile(session.path, body);
    session.received += body.byteLength;
    session.updatedAt = Date.now();
    return res.json({ nextOffset: session.received });
  });

  app.post("/api/admin/media-upload/complete", express.json({ limit: "1mb" }), async (req, res) => {
    const user = await getAdminUser(req);
    if (!user) return res.status(403).json({ error: "Bạn không có quyền upload media" });

    const uploadId = String(req.body?.uploadId || "");
    const session = uploadSessions.get(uploadId);
    if (!session || session.openId !== user.openId) return res.status(404).json({ error: "Phiên upload không tồn tại" });
    if (session.received !== session.size) return res.status(409).json({ error: `File chưa tải đủ (${session.received}/${session.size} bytes)` });

    try {
      const uploaded = await storagePutFile(`media/${session.kind}s/${safeFileName(session.fileName, session.kind)}`, session.path, session.contentType, session.size);
      const record = await db.createVideo({
        title: session.title.slice(0, 255),
        category: session.category.slice(0, 120),
        kind: session.kind,
        storageKey: uploaded.key,
        contentType: session.contentType,
        fileSize: session.size,
        createdByOpenId: session.openId,
        isPublished: 1,
      });
      uploadSessions.delete(uploadId);
      await fs.unlink(session.path).catch(() => undefined);
      return res.status(201).json({ id: String(record.id), src: uploaded.url, title: record.title, category: record.category, kind: record.kind, fileSize: record.fileSize });
    } catch (error) {
      console.error("[Media upload complete]", error);
      return res.status(500).json({ error: error instanceof Error ? error.message : "Không thể lưu media" });
    }
  });

  // Metadata APIs stay small; upload chunks use the route-specific raw parser above.
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });
  registerOAuthRoutes(app);
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  if (process.env.NODE_ENV === "development") await setupVite(app, server);
  else serveStatic(app);

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });
