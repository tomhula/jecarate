CREATE TABLE IF NOT EXISTS `user`
(
    `id`       INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS `food`
(
    `id`      INT AUTO_INCREMENT PRIMARY KEY,
    `name`    VARCHAR(255) NOT NULL,
    `is_soup` BOOLEAN      NOT NULL
);

CREATE TABLE IF NOT EXISTS `lunch_rating`
(
    `id`          INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`     INT   NOT NULL,
    `food_id`     INT   NOT NULL,
    `ration`      FLOAT NOT NULL,
    `taste`       FLOAT NOT NULL,
    `price`       FLOAT NOT NULL,
    `temperature` FLOAT NOT NULL,
    `looks`       FLOAT NOT NULL,
    `lunch_date`  DATE  NOT NULL,
    `desert`      FLOAT,
    `rating`      FLOAT GENERATED ALWAYS AS (
        IF(`desert` IS NOT NULL,
           (`ration` + `taste` + `price` + `temperature` + `looks` + `desert`) / 6,
           (`ration` + `taste` + `price` + `temperature` + `looks`) / 5)
        ) VIRTUAL,
    CONSTRAINT `chk_ration` CHECK (`ration` >= 0.0 AND `ration` <= 5.0),
    CONSTRAINT `chk_taste` CHECK (`taste` >= 0.0 AND `taste` <= 5.0),
    CONSTRAINT `chk_price` CHECK (`price` >= 0.0 AND `price` <= 5.0),
    CONSTRAINT `chk_temperature` CHECK (`temperature` >= 0.0 AND `temperature` <= 5.0),
    CONSTRAINT `chk_looks` CHECK (`looks` >= 0.0 AND `looks` <= 5.0),
    CONSTRAINT `fk_food` FOREIGN KEY (`food_id`) REFERENCES `food` (`id`),
    CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

DROP VIEW IF EXISTS `all_ratings`;

CREATE VIEW `all_ratings` AS
SELECT `lunch_rating`.`id` AS `rating_id`,
       `food`.`name`       AS `food_name`,
       `lunch_rating`.`rating`,
       `lunch_rating`.`lunch_date`
FROM `lunch_rating`
         JOIN
     `food` ON `lunch_rating`.`food_id` = `food`.`id`;

DROP PROCEDURE IF EXISTS HasRatedToday;

CREATE PROCEDURE HasRatedToday(IN p_user_id VARCHAR(255))
SELECT food.id, food.is_soup
FROM lunch_rating
         JOIN food ON lunch_rating.food_id = food.id
WHERE p_user_id IN (SELECT user.username
                    FROM user
                    WHERE user.id = lunch_rating.user_id)
  AND lunch_rating.lunch_date = CURDATE();

