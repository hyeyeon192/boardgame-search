CREATE TABLE `board_games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`min_players` int NOT NULL,
	`max_players` int NOT NULL,
	`play_time` int NOT NULL,
	`genres` json NOT NULL,
	`image_url` varchar(512),
	`complexity` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `board_games_id` PRIMARY KEY(`id`)
);
