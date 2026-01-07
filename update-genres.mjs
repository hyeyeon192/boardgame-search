import { drizzle } from 'drizzle-orm/mysql2';
import { boardGames } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

const genreMap = {
  "Strategy": "전략",
  "Negotiation": "협상",
  "Family": "가족",
  "Cooperative": "협력",
  "Party": "파티",
  "Word": "단어",
  "Economic": "경제",
  "Card Game": "카드",
  "Abstract": "추상",
  "Adventure": "모험",
};

const games = [
  { id: 1, genres: ["전략", "협상"] },
  { id: 2, genres: ["가족", "전략"] },
  { id: 3, genres: ["협력", "전략"] },
  { id: 4, genres: ["파티", "단어"] },
  { id: 5, genres: ["전략", "경제"] },
  { id: 6, genres: ["전략", "카드"] },
  { id: 7, genres: ["전략", "카드"] },
  { id: 8, genres: ["협력", "카드"] },
  { id: 9, genres: ["추상", "가족"] },
  { id: 10, genres: ["모험", "전략"] },
  { id: 11, genres: ["파티", "단어"] },
  { id: 12, genres: ["전략", "가족"] },
];

try {
  console.log('Updating game genres to Korean...');
  for (const game of games) {
    await db.update(boardGames)
      .set({ genres: game.genres })
      .where(eq(boardGames.id, game.id));
  }
  console.log(`✓ Successfully updated ${games.length} games!`);
  process.exit(0);
} catch (error) {
  console.error('Error updating genres:', error);
  process.exit(1);
}
