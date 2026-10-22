CREATE TABLE `videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(120) NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`contentType` varchar(120) NOT NULL,
	`fileSize` int NOT NULL,
	`createdByOpenId` varchar(64) NOT NULL,
	`isPublished` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`),
	CONSTRAINT `videos_storageKey_unique` UNIQUE(`storageKey`)
);
