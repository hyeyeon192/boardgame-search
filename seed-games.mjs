import { drizzle } from 'drizzle-orm/mysql2';
import { boardGames } from './drizzle/schema.ts';

const db = drizzle(process.env.DATABASE_URL);

const games = [
  {
    name: "Catan",
    minPlayers: 3,
    maxPlayers: 4,
    playTime: 60,
    genres: ["Strategy", "Negotiation"],
    description: "Collect resources and build settlements on the island of Catan.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 2,
  },
  {
    name: "Ticket to Ride",
    minPlayers: 2,
    maxPlayers: 5,
    playTime: 45,
    genres: ["Family", "Strategy"],
    description: "Build train routes across the country in this classic railway adventure.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 2,
  },
  {
    name: "Pandemic",
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 45,
    genres: ["Cooperative", "Strategy"],
    description: "Work together as a team to treat infections and find cures.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 2,
  },
  {
    name: "Codenames",
    minPlayers: 2,
    maxPlayers: 8,
    playTime: 15,
    genres: ["Party", "Word"],
    description: "Give one-word clues to help your team identify their agents.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 1,
  },
  {
    name: "Terraforming Mars",
    minPlayers: 1,
    maxPlayers: 5,
    playTime: 120,
    genres: ["Strategy", "Economic"],
    description: "Compete to transform Mars into a habitable planet.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 3,
  },
  {
    name: "Splendor",
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 30,
    genres: ["Strategy", "Card Game"],
    description: "Collect gems and build your jewelry empire.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 2,
  },
  {
    name: "7 Wonders Duel",
    minPlayers: 2,
    maxPlayers: 2,
    playTime: 30,
    genres: ["Strategy", "Card Game"],
    description: "Develop your civilization and crush your opponent in this 2-player game.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 2,
  },
  {
    name: "The Crew: The Quest for Planet Nine",
    minPlayers: 2,
    maxPlayers: 5,
    playTime: 20,
    genres: ["Cooperative", "Card Game"],
    description: "A cooperative trick-taking game that takes you on a space adventure.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 2,
  },
  {
    name: "Azul",
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 30,
    genres: ["Abstract", "Family"],
    description: "Draft beautiful tiles to decorate the Royal Palace of Evora.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 2,
  },
  {
    name: "Gloomhaven",
    minPlayers: 1,
    maxPlayers: 4,
    playTime: 120,
    genres: ["Adventure", "Strategy"],
    description: "A tactical combat game in a persistent world of shifting motives.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 4,
  },
  {
    name: "Just One",
    minPlayers: 3,
    maxPlayers: 7,
    playTime: 20,
    genres: ["Party", "Word"],
    description: "A cooperative party game where you write clues to help a player guess a word.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 1,
  },
  {
    name: "Wingspan",
    minPlayers: 1,
    maxPlayers: 5,
    playTime: 60,
    genres: ["Strategy", "Family"],
    description: "Attract the best birds to your wildlife preserve.",
    imageUrl: "/images/game-placeholder.png",
    complexity: 2,
  }
];

try {
  console.log('Seeding board games...');
  for (const game of games) {
    await db.insert(boardGames).values(game);
  }
  console.log(`✓ Successfully seeded ${games.length} games!`);
  process.exit(0);
} catch (error) {
  console.error('Error seeding games:', error);
  process.exit(1);
}
