DROP INDEX IF EXISTS "files_file_storage_key_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "rules_name_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "user_email_unique";--> statement-breakpoint
ALTER TABLE `files` ALTER COLUMN "confidence" TO "confidence" text;--> statement-breakpoint
CREATE UNIQUE INDEX `files_file_storage_key_unique` ON `files` (`file_storage_key`);--> statement-breakpoint
CREATE UNIQUE INDEX `rules_name_unique` ON `rules` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `files` ADD `social_profile` text;--> statement-breakpoint
ALTER TABLE `files` ADD `provider_profile` text;