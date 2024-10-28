ALTER TABLE `types` RENAME TO `claim`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_files` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`file_storage_key` text NOT NULL,
	`size` integer NOT NULL,
	`type` text NOT NULL,
	`claim_id` text NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `claim`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_files`("id", "created_at", "name", "file_storage_key", "size", "type", "claim_id") SELECT "id", "created_at", "name", "file_storage_key", "size", "type", "claim_id" FROM `files`;--> statement-breakpoint
DROP TABLE `files`;--> statement-breakpoint
ALTER TABLE `__new_files` RENAME TO `files`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `files_file_storage_key_unique` ON `files` (`file_storage_key`);