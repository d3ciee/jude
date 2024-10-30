ALTER TABLE `files` RENAME COLUMN "confidence" TO "extracted_data_confidence";--> statement-breakpoint
ALTER TABLE `files` DROP COLUMN `social_profile`;--> statement-breakpoint
ALTER TABLE `claim` ADD `social_profile` text;--> statement-breakpoint
ALTER TABLE `claim` ADD `social_profile_confidence` text;