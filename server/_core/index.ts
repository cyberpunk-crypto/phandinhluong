import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { publicPlatformScript } from "./publicConfig";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { sdk } from "./sdk";
import * as db from "../db";
import { storagePut } from "../storage";

const MAX_MEDIA_BYTES = 2 * 1024 * 1024 * 1024;

function decodeHeader(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  try { return decodeURIComponent(value); } catch { return fallback; }
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.post("/api/admin/media-upload", express.raw({ type: "application/octet-stream", limit: "2gb" }), async (req, res) => {
    try {
      let user = null;
      try { user = await sdk.authenticateRequest(req); } catch { user = null; }
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Bạn không có quyền upload media" });
      }

      const body = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body ?? "");
      const kind = req.headers["x-media-kind"] === "image" ? "image" : req.headers["x-media-kind"] === "video" ? "video" : null;
      const contentType = String(req.headers["x-content-type"] || "");
      if (!kind || !/^(image|video)\//.test(contentType)) {
        return res.status(400).json({ error: "Thiếu loại file ảnh/video hợp lệ" });
      }
      if (!body.byteLength || body.byteLength > MAX_MEDIA_BYTES) {
        return res.status(413).json({ error: "Ảnh hoặc video phải nhỏ hơn hoặc bằng 2 GB" });
      }

      const fileName = decodeHeader(String(req.headers["x-file-name"] || ""), kind === "image" ? "image.jpg" : "video.mp4");
      const title = decodeHeader(String(req.headers["x-title"] || ""), fileName.replace(/\.[^/.]+$/, ""));
      const category = decodeHeader(String(req.headers["x-category"] || ""), kind === "image" ? "Hình ảnh sự kiện" : "MC sự kiện");
      const safeName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-160) || (kind === "image" ? "image.jpg" : "video.mp4");
      const uploaded = await storagePut(`media/${kind}s/${safeName}`, body, contentType);
      const record = await db.createVideo({
        title: title.slice(0, 255),
        category: category.slice(0, 120),
        kind,
        storageKey: uploaded.key,
        contentType,
        fileSize: body.byteLength,
        createdByOpenId: user.openId,
        isPublished: 1,
      });
      return res.status(201).json({ id: String(record.id), src: uploaded.url, title, category, kind, fileSize: body.byteLength });
    } catch (error) {
      console.error("[Media upload]", error);
      return res.status(500).json({ error: error instanceof Error ? error.message : "Không thể lưu media" });
    }
  });

  // Metadata APIs stay small; large media uses the raw upload endpoint above.
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/api/platform/config.js", (_req, res) => {
    res.set("Cache-Control", "no-store").type("application/javascript").send(publicPlatformScript());
  });
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT || "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid PORT");
  server.on("error", error => { console.error("Server failed:", error.message); process.exit(1); });
  server.listen(port, "0.0.0.0", () => console.log(`Server listening on port ${port}`));
}

startServer().catch(error => { console.error(error); process.exit(1); });
