CREATE TABLE `whatsapp_session` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`msisdn` text NOT NULL,
	`step` integer DEFAULT 0,
	`status` text NOT NULL,
	`member_number` text
);
