import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllBoardGames, searchBoardGames, addBoardGame } from "./db";

export const appRouter = router({
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

  games: router({
    list: publicProcedure.query(async () => {
      return await getAllBoardGames();
    }),
    search: publicProcedure
      .input(
        z.object({
          query: z.string().optional(),
          players: z.number().optional(),
          genre: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return await searchBoardGames({
          query: input.query,
          players: input.players,
          genre: input.genre,
        });
      }),
    add: publicProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          minPlayers: z.number(),
          maxPlayers: z.number(),
          playTime: z.number(),
          genres: z.array(z.string()),
          mechanics: z.array(z.string()).optional(),
          themes: z.array(z.string()).optional(),
          complexity: z.number(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await addBoardGame({
          name: input.name,
          description: input.description || "",
          minPlayers: input.minPlayers,
          maxPlayers: input.maxPlayers,
          playTime: input.playTime,
          genres: input.genres,
          mechanics: input.mechanics || [],
          themes: input.themes || [],
          complexity: input.complexity,
          imageUrl: input.imageUrl || "/images/game-placeholder.png",
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
