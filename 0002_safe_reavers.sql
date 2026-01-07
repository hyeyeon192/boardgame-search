ALTER TABLE `board_games` ADD `mechanics` json NOT NULL;--> statement-breakpoint
ALTER TABLE `board_games` ADD `themes` json NOT NULL;--> statement-breakpoint
ALTER TABLE `board_games` ADD `lent_to` varchar(100);