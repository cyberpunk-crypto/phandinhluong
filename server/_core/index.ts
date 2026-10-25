import "dotenv/config";
import express from "express";
import { createServer } from "http";
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
import { storageGetSignedUrl, storagePut, storagePutFile } from "../storage";

const MAX_MEDIA_BYTES = 2 * 1024 * 1024 * 1024;
const CHUNK_SIZE = 8 * 1024 * 1024;

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

function isUploadId(value: string) {
  return /^[a-f0-9-]{36}$/i.test(value);
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

    return res.json({ uploadId: randomUUID(), chunkSize: CHUNK_SIZE });
  });

  app.post("/api/admin/media-upload/chunk", express.raw({ type: "application/octet-stream", limit: "12mb" }), async (req, res) => {
    const user = await getAdminUser(req);
    if (!user) return res.status(403).json({ error: "Bạn không có quyền upload media" });

    const uploadId = String(req.headers["x-upload-id"] || "");
    const offset = Number(req.headers["x-offset"]);
    const body = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
    if (!isUploadId(uploadId)) return res.status(400).json({ error: "Mã phiên upload không hợp lệ" });
    if (!Number.isSafeInteger(offset) || offset < 0) return res.status(400).json({ error: "Offset upload không hợp lệ" });
    if (!body.byteLength || body.byteLength > CHUNK_SIZE) return res.status(413).json({ error: "Kích thước chunk không hợp lệ" });

    try {
      const stored = await storagePut(`media-upload-chunks/${uploadId}/${offset}.part`, body, "application/octet-stream");
      return res.json({ nextOffset: offset + body.byteLength, key: stored.key, size: body.byteLength });
    } catch (error) {
      console.error("[Media upload chunk]", error);
      return res.status(502).json({ error: error instanceof Error ? error.message : "Không thể lưu chunk lên Storage" });
    }
  });

  app.post("/api/admin/media-upload/complete", express.json({ limit: "1mb" }), async (req, res) => {
    const user = await getAdminUser(req);
    if (!user) return res.status(403).json({ error: "Bạn không có quyền upload media" });

    const uploadId = String(req.body?.uploadId || "");
    const kind = req.body?.kind === "image" ? "image" : req.body?.kind === "video" ? "video" : null;
    const contentType = text(req.body?.contentType, "");
    const size = Number(req.body?.size);
    const chunks = Array.isArray(req.body?.chunks) ? req.body.chunks : [];
    if (!isUploadId(uploadId) || !kind || !/^(image|video)\//.test(contentType) || !Number.isSafeInteger(size) || size <= 0 || size > MAX_MEDIA_BYTES) {
      return res.status(400).json({ error: "Thông tin hoàn tất upload không hợp lệ" });
    }
    if (chunks.length === 0 || chunks.length > Math.ceil(MAX_MEDIA_BYTES / CHUNK_SIZE)) return res.status(400).json({ error: "Danh sách chunk không hợp lệ" });

    const ordered = [...chunks].sort((a, b) => Number(a.offset) - Number(b.offset));
    let expectedOffset = 0;
    let totalSize = 0;
    for (const chunk of ordered) {
      const offset = Number(chunk?.offset);
      const chunkSize = Number(chunk?.size);
      const key = String(chunk?.key || "");
      if (!Number.isSafeInteger(offset) || offset !== expectedOffset || !Number.isSafeInteger(chunkSize) || chunkSize <= 0 || chunkSize > CHUNK_SIZE || !key.startsWith(`media-upload-chunks/${uploadId}/`)) {
        return res.status(400).json({ error: "Chunk bị thiếu, sai thứ tự hoặc không thuộc phiên upload này" });
      }
      expectedOffset += chunkSize;
      totalSize += chunkSize;
    }
    if (totalSize !== size) return res.status(409).json({ error: `Kích thước chunk chưa đủ (${totalSize}/${size} bytes)` });

    const tempPath = path.join(os.tmpdir(), `phan-media-${uploadId}.upload`);
    try {
      await fs.writeFile(tempPath, Buffer.alloc(0));
      for (const chunk of ordered) {
        const signedUrl = await storageGetSignedUrl(String(chunk.key));
        const response = await fetch(signedUrl);
        if (!response.ok) throw new Error(`Không đọc được chunk Storage (${response.status})`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.byteLength !== Number(chunk.size)) throw new Error("Kích thước chunk Storage không khớp");
        await fs.appendFile(tempPath, bytes);
      }

      const fileName = text(req.body?.fileName, kind === "image" ? "image.jpg" : "video.mp4");
      const title = text(req.body?.title, fileName.replace(/\.[^/.]+$/, ""));
      const category = text(req.body?.category, kind === "image" ? "Hình ảnh sự kiện" : "MC sự kiện");
      const uploaded = await storagePutFile(`media/${kind}s/${safeFileName(fileName, kind)}`, tempPath, contentType, size);
      const record = await db.createVideo({
        title: title.slice(0, 255),
        category: category.slice(0, 120),
        kind,
        storageKey: uploaded.key,
        contentType,
        fileSize: size,
        createdByOpenId: user.openId,
        isPublished: 1,
      });
      return res.status(201).json({ id: String(record.id), src: uploaded.url, title: record.title, category: record.category, kind: record.kind, fileSize: record.fileSize });
    } catch (error) {
      console.error("[Media upload complete]", error);
      return res.status(500).json({ error: error instanceof Error ? error.message : "Không thể hoàn tất upload" });
    } finally {
      await fs.unlink(tempPath).catch(() => undefined);
    }
  });

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
