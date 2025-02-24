CREATE TABLE IF NOT EXISTS `user`
(
    `id`        int AUTO_INCREMENT PRIMARY KEY,
    `user_hash` varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `food`
(
    `id`   int AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `lunch_rating`
(
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `food_id`    INT NOT NULL,
    `rating`     FLOAT NOT NULL,
    `lunch_date` DATE NOT NULL,
    CONSTRAINT `chk_rating` CHECK (`rating` >= 0.0 AND `rating` <= 5.0),
    CONSTRAINT `fk_food` FOREIGN KEY (`food_id`) REFERENCES `food` (`id`)
);

DROP VIEW IF EXISTS `all_ratings`;

CREATE VIEW `all_ratings` AS
SELECT
    `lunch_rating`.`id` AS `rating_id`,
    `food`.`name` AS `food_name`,
    `lunch_rating`.`rating`,
    `lunch_rating`.`lunch_date`
FROM
    `lunch_rating`
        JOIN
    `food` ON `lunch_rating`.`food_id` = `food`.`id`;