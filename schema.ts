import { z } from "zod";

export const boardGameSchema = z.object({
  id: z.number(),
  name: z.string(),
  minPlayers: z.number(),
  maxPlayers: z.number(),
  playTime: z.number(), // in minutes
  genre: z.array(z.string()),
  description: z.string(),
  imageUrl: z.string(),
  complexity: z.number().min(1).max(5), // 1: Easy, 5: Hard
});

export type BoardGame = z.infer<typeof boardGameSchema>;

export const searchParamsSchema = z.object({
  players: z.number().optional(),
  genre: z.string().optional(),
  query: z.string().optional(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
