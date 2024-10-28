CREATE TABLE `types` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`stage` text NOT NULL,
	`processing_step` text,
	`submitted_by` text NOT NULL,
	`submission_channel` text
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`size` integer NOT NULL,
	`type` text NOT NULL,
	`claim_id` text NOT NULL,
	FOREIGN KEY (`claim_id`) REFERENCES `types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rules_name_unique` ON `rules` (`name`);