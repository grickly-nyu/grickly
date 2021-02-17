CREATE TABLE `user` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `userName` varchar(255)
);

CREATE TABLE `user_info` (
  `id` int PRIMARY KEY,
  `created_at` timestamp,
  `email` varchar(255),
  `phone` int
);

CREATE TABLE `chatroom` (
  `room_id` int PRIMARY KEY AUTO_INCREMENT,
  `private` boolean,
  `password` int
);

CREATE TABLE `participant` (
  `userid` int,
  `room_id` int,
  PRIMARY KEY (`userid`, `room_id`)
);

CREATE TABLE `message` (
  `id` int PRIMARY KEY,
  `sender` int,
  `room_id` int,
  `sent` boolean,
  `sendTime` timestamp
);

CREATE TABLE `interest` (
  `user_id` int,
  `interest` varchar(255),
  PRIMARY KEY (`user_id`, `interest`)
);

CREATE TABLE `match` (
  `user_id` int,
  `match` int,
  `match_time` timestamp,
  PRIMARY KEY (`user_id`, `match`)
);

CREATE TABLE `event` (
  `event_id` int PRIMARY KEY AUTO_INCREMENT,
  `event_name` varchar(255),
  `event_time` timestamp,
  `created_time` timestamp
);

CREATE TABLE `event_info` (
  `event_id` int,
  `organizer` int,
  `follower` int,
  `has_room` boolean,
  `room_id` int,
  PRIMARY KEY (`event_id`, `organizer`, `follower`, `room_id`)
);

ALTER TABLE `user_info` ADD FOREIGN KEY (`id`) REFERENCES `user` (`id`);

ALTER TABLE `participant` ADD FOREIGN KEY (`userid`) REFERENCES `user` (`id`);

ALTER TABLE `participant` ADD FOREIGN KEY (`room_id`) REFERENCES `chatroom` (`room_id`);

ALTER TABLE `message` ADD FOREIGN KEY (`sender`) REFERENCES `user` (`id`);

ALTER TABLE `message` ADD FOREIGN KEY (`room_id`) REFERENCES `chatroom` (`room_id`);

ALTER TABLE `interest` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `match` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `match` ADD FOREIGN KEY (`match`) REFERENCES `user` (`id`);

ALTER TABLE `event_info` ADD FOREIGN KEY (`event_id`) REFERENCES `event` (`event_id`);

ALTER TABLE `event_info` ADD FOREIGN KEY (`organizer`) REFERENCES `user` (`id`);

ALTER TABLE `event_info` ADD FOREIGN KEY (`follower`) REFERENCES `user` (`id`);

ALTER TABLE `event_info` ADD FOREIGN KEY (`room_id`) REFERENCES `chatroom` (`room_id`);

