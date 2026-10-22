import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, InsertVideo, users, videos } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    throw new Error("Database is not available");
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listPublishedVideos() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(videos)
    .where(eq(videos.isPublished, 1))
    .orderBy(desc(videos.createdAt));
}

export async function listAllVideos() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(videos).orderBy(desc(videos.createdAt));
}

export async function createVideo(video: InsertVideo) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  const result = await db.insert(videos).values(video);
  const insertedId = Number((result as { insertId?: number }).insertId);
  if (!insertedId) throw new Error("Video insert did not return an id");

  const inserted = await db.select().from(videos).where(eq(videos.id, insertedId)).limit(1);
  return inserted[0];
}

export async function updateVideo(
  id: number,
  values: Partial<Pick<InsertVideo, "title" | "category" | "isPublished">>,
) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");

  await db.update(videos).set(values).where(eq(videos.id, id));
  const updated = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  return updated[0];
}
