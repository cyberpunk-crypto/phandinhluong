import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import * as db from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { storagePut } from "./storage";

const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function toPublicVideo(video: Awaited<ReturnType<typeof db.listPublishedVideos>>[number]) {
  return {
    id: String(video.id),
    title: video.title,
    category: video.category,
    src: `/manus-storage/${video.storageKey}`,
    contentType: video.contentType,
    fileSize: video.fileSize,
    createdAt: video.createdAt,
  };
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  videos: router({
    list: publicProcedure.query(async () => {
      try {
        const records = await db.listPublishedVideos();
        return records.map(toPublicVideo);
      } catch (error) {
        console.warn("[Videos] Public list unavailable:", error instanceof Error ? error.message : error);
        return [];
      }
    }),
  }),

  admin: router({
    videos: router({
      list: adminProcedure.query(async () => {
        const records = await db.listAllVideos();
        return records.map(video => ({
          ...video,
          id: String(video.id),
          src: `/manus-storage/${video.storageKey}`,
          isPublished: Boolean(video.isPublished),
        }));
      }),

      create: adminProcedure
        .input(z.object({
          title: z.string().trim().min(1).max(255),
          category: z.string().trim().min(1).max(120),
          fileName: z.string().trim().min(1).max(255),
          contentType: z.string().regex(/^video\//, "Chỉ nhận tệp video"),
          data: z.string().min(1),
        }))
        .mutation(async ({ ctx, input }) => {
          const bytes = Buffer.from(input.data, "base64");
          if (bytes.byteLength > MAX_VIDEO_BYTES) {
            throw new Error("Video vượt quá giới hạn 50 MB");
          }

          const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-160) || "video.mp4";
          const uploaded = await storagePut(`videos/${safeName}`, bytes, input.contentType);
          const record = await db.createVideo({
            title: input.title,
            category: input.category,
            storageKey: uploaded.key,
            contentType: input.contentType,
            fileSize: bytes.byteLength,
            createdByOpenId: ctx.user.openId,
            isPublished: 1,
          });

          return {
            ...record,
            id: String(record.id),
            src: uploaded.url,
            isPublished: true,
          };
        }),

      update: adminProcedure
        .input(z.object({
          id: z.coerce.number().int().positive(),
          title: z.string().trim().min(1).max(255),
          category: z.string().trim().min(1).max(120),
          isPublished: z.boolean(),
        }))
        .mutation(async ({ input }) => {
          const record = await db.updateVideo(input.id, {
            title: input.title,
            category: input.category,
            isPublished: input.isPublished ? 1 : 0,
          });
          if (!record) throw new Error("Video không tồn tại");
          return {
            ...record,
            id: String(record.id),
            src: `/manus-storage/${record.storageKey}`,
            isPublished: Boolean(record.isPublished),
          };
        }),

      archive: adminProcedure
        .input(z.object({ id: z.coerce.number().int().positive() }))
        .mutation(async ({ input }) => {
          const record = await db.updateVideo(input.id, { isPublished: 0 });
          if (!record) throw new Error("Video không tồn tại");
          return { success: true } as const;
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
