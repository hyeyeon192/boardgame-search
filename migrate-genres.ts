import { drizzle } from "drizzle-orm/mysql2";
import { boardGames } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// 장르 목록
const GENRES = ["■", "블러핑", "머미", "가족", "경제", "단어", "모험", "전략", "추상", "카드", "파티", "협력", "협상"];

async function migrateGenres() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL 환경변수가 필요합니다.");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);
  
  console.log("=== 진행방식/테마에서 장르로 데이터 이동 시작 ===\n");

  const games = await db.select().from(boardGames);

  let updatedCount = 0;

  for (const game of games) {
    const genres = game.genres || [];
    const mechanics = game.mechanics || [];
    const themes = game.themes || [];

    // 진행방식에서 장르로 옮길 항목
    const mechanicsToMove = mechanics.filter(m => GENRES.includes(m));
    // 테마에서 장르로 옮길 항목
    const themesToMove = themes.filter(t => GENRES.includes(t));

    if (mechanicsToMove.length > 0 || themesToMove.length > 0) {
      console.log(`게임: ${game.name} (ID: ${game.id})`);
      
      // 새 장르 목록 (기존 + 이동할 항목, 중복 제거)
      const newGenres = [...new Set([...genres, ...mechanicsToMove, ...themesToMove])];
      // 새 진행방식 목록 (이동할 항목 제거)
      const newMechanics = mechanics.filter(m => !GENRES.includes(m));
      // 새 테마 목록 (이동할 항목 제거)
      const newThemes = themes.filter(t => !GENRES.includes(t));

      if (mechanicsToMove.length > 0) {
        console.log(`  진행방식 → 장르: ${mechanicsToMove.join(', ')}`);
      }
      if (themesToMove.length > 0) {
        console.log(`  테마 → 장르: ${themesToMove.join(', ')}`);
      }

      // 데이터베이스 업데이트
      await db.update(boardGames)
        .set({
          genres: newGenres,
          mechanics: newMechanics,
          themes: newThemes,
        })
        .where(eq(boardGames.id, game.id));

      console.log(`  ✅ 업데이트 완료\n`);
      updatedCount++;
    }
  }

  console.log(`=== 마이그레이션 완료: ${updatedCount}개 게임 업데이트됨 ===`);
  process.exit(0);
}

migrateGenres().catch(console.error);
