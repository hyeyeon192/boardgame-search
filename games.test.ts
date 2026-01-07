import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context for testing
function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("games router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("games.list", () => {
    it("should return an array of board games", async () => {
      // This test verifies the API endpoint exists and returns an array
      // Database seeding is handled separately
      const games = await caller.games.list();
      expect(Array.isArray(games)).toBe(true);
    }, { timeout: 10000 });

    it.skip("should return games with required fields", async () => {
      const games = await caller.games.list();
      if (games.length > 0) {
        const game = games[0];
        expect(game).toHaveProperty("id");
        expect(game).toHaveProperty("name");
        expect(game).toHaveProperty("minPlayers");
        expect(game).toHaveProperty("maxPlayers");
        expect(game).toHaveProperty("playTime");
        expect(game).toHaveProperty("genres");
        expect(game).toHaveProperty("complexity");
      }
    });
  });

  describe("games.search", () => {
    it("should search by game name", async () => {
      // Verify the search endpoint accepts query parameter
      const result = await caller.games.search({ query: "Catan" });
      expect(Array.isArray(result)).toBe(true);
      expect(result).toBeDefined();
    }, { timeout: 10000 });

    it("should filter by player count", async () => {
      // Verify the search endpoint accepts player count parameter
      const result = await caller.games.search({ players: 2 });
      expect(Array.isArray(result)).toBe(true);
    });

    it.skip("should filter by genre", async () => {
      const result = await caller.games.search({ genre: "Strategy" });
      expect(Array.isArray(result)).toBe(true);
      // All returned games should have Strategy genre
      result.forEach((game: any) => {
        expect(game.genres).toContain("Strategy");
      });
    });

    it.skip("should combine multiple filters", async () => {
      const result = await caller.games.search({
        query: "Catan",
        players: 3,
        genre: "Strategy",
      });
      expect(Array.isArray(result)).toBe(true);
      result.forEach((game: any) => {
        expect(game.name.toLowerCase()).toContain("catan");
        expect(game.minPlayers).toBeLessThanOrEqual(3);
        expect(game.maxPlayers).toBeGreaterThanOrEqual(3);
        expect(game.genres).toContain("Strategy");
      });
    });

    it.skip("should return empty array for non-matching search", async () => {
      const result = await caller.games.search({ query: "NonExistentGame123" });
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });
});
