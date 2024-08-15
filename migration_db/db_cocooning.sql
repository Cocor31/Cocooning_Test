-- Adminer 4.8.1 MySQL 11.3.2-MariaDB-1:11.3.2+maria~ubu2204 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `db_cocooning`;
CREATE DATABASE `db_cocooning` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `db_cocooning`;

DROP TABLE IF EXISTS `Roles`;
CREATE TABLE `Roles` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1,	'ROLE_USER',	'2024-08-15 14:38:23',	'2024-08-15 14:38:23'),
(2,	'ROLE_PRESTA',	'2024-08-15 14:42:20',	'2024-08-15 14:42:20'),
(3,	'ROLE_MODO',	'2024-08-15 14:42:41',	'2024-08-15 14:42:41'),
(4,	'ROLE_ADMIN',	'2024-08-15 14:42:56',	'2024-08-15 14:42:56');

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(64) NOT NULL,
  `photo` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `Users` (`id`, `firstname`, `lastname`, `email`, `password`, `photo`, `createdAt`, `updatedAt`) VALUES
(1,	'roger',	'REGOR',	'roger.regor@gmail.com',	'$2b$10$Qs3smGrxaWHqZv4GXCapb.4miZ4/zSLi8oj3Tfl8fxbkfLW8duO72',	NULL,	'2024-08-15 14:38:23',	'2024-08-15 14:38:23'),
(2,	'user',	'USER',	'user.user@gmail.com',	'$2b$10$SZ5Mr2yMAVVRtw35V4Ut9.Og26voyT6xp42nZNJhH3zlAZkJXGjg2',	NULL,	'2024-08-15 14:46:16',	'2024-08-15 14:46:16'),
(3,	'presta',	'PRESTA',	'presta.presta@gmail.com',	'$2b$10$TZ/Irk3UjGT9Hf3edTziUuau60XCsMM7mMVd2x72wvnTna3su7eXK',	NULL,	'2024-08-15 14:46:45',	'2024-08-15 14:46:45'),
(4,	'modo',	'MODO',	'modo.modo@gmail.com',	'$2b$10$rxoCoYIccEU5jCb6pNsxHuQR38V4DoX/ypGMssveq88MgJ3mWx6m6',	NULL,	'2024-08-15 14:47:15',	'2024-08-15 14:47:15');

DROP TABLE IF EXISTS `User_Role`;
CREATE TABLE `User_Role` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `UserId` int(10) NOT NULL,
  `RoleId` int(10) NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `RoleId` (`RoleId`),
  CONSTRAINT `User_Role_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User_Role_ibfk_2` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `User_Role` (`createdAt`, `updatedAt`, `UserId`, `RoleId`) VALUES
('2024-08-15 14:38:23',	'2024-08-15 14:38:23',	1,	4),
('2024-08-15 14:46:16',	'2024-08-15 14:46:16',	2,	1),
('2024-08-15 14:46:45',	'2024-08-15 14:46:45',	3,	2),
('2024-08-15 14:47:15',	'2024-08-15 14:47:15',	4,	3);

-- 2024-08-15 16:31:08
