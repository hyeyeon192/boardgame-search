import { eq, and, lte, gte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, boardGames, InsertBoardGame } from "../drizzle/schema";
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
    console.warn("[Database] Cannot upsert user: database not available");
    return;
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

// Board game queries

export async function getAllBoardGames() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get games: database not available");
    return [];
  }

  try {
    const result = await db.select().from(boardGames);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get games:", error);
    throw error;
  }
}

export async function searchBoardGames(filters: {
  query?: string;
  players?: number;
  genre?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search games: database not available");
    return [];
  }

  try {
    const conditions: any[] = [];

    if (filters.query) {
      conditions.push(
        sql`LOWER(${boardGames.name}) LIKE LOWER(${`%${filters.query}%`})`
      );
    }

    if (filters.players !== undefined) {
      conditions.push(
        and(
          lte(boardGames.minPlayers, filters.players),
          gte(boardGames.maxPlayers, filters.players)
        )
      );
    }

    if (filters.genre) {
      conditions.push(
        sql`JSON_CONTAINS(${boardGames.genres}, JSON_QUOTE(${filters.genre}))`
      );
    }

    let query: any = db.select().from(boardGames);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const result = await query;
    return result;
  } catch (error) {
    console.error("[Database] Failed to search games:", error);
    throw error;
  }
}

export async function addBoardGame(game: InsertBoardGame) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot add game: database not available");
    return null;
  }

  try {
    const result = await db.insert(boardGames).values(game);
    return result;
  } catch (error) {
    console.error("[Database] Failed to add game:", error);
    throw error;
  }
}

export async function updateBoardGame(id: number, game: Partial<InsertBoardGame>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update game: database not available");
    return null;
  }

  try {
    const result = await db.update(boardGames).set(game).where(eq(boardGames.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to update game:", error);
    throw error;
  }
}

export async function deleteBoardGame(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete game: database not available");
    return null;
  }

  try {
    const result = await db.delete(boardGames).where(eq(boardGames.id, id));
    return result;
  } catch (error) {
    console.error("[Database] Failed to delete game:", error);
    throw error;
  }
}
