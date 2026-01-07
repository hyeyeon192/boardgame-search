import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'boardgame',
  ssl: { rejectUnauthorized: false }
});

// 장르 목록
const GENRES = ["■", "블러핑", "머미", "가족", "경제", "단어", "모험", "전략", "추상", "카드", "파티", "협력", "협상"];

const [rows] = await connection.execute('SELECT id, name, genres, mechanics, themes FROM board_games');

console.log("=== 진행방식/테마에서 장르로 옮겨야 할 항목 ===\n");

for (const row of rows) {
  const genres = JSON.parse(row.genres || '[]');
  const mechanics = JSON.parse(row.mechanics || '[]');
  const themes = JSON.parse(row.themes || '[]');
  
  const mechanicsToMove = mechanics.filter(m => GENRES.includes(m));
  const themesToMove = themes.filter(t => GENRES.includes(t));
  
  if (mechanicsToMove.length > 0 || themesToMove.length > 0) {
    console.log(`게임: ${row.name} (ID: ${row.id})`);
    if (mechanicsToMove.length > 0) {
      console.log(`  진행방식 → 장르: ${mechanicsToMove.join(', ')}`);
    }
    if (themesToMove.length > 0) {
      console.log(`  테마 → 장르: ${themesToMove.join(', ')}`);
    }
    console.log();
  }
}

await connection.end();
