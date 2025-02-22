CREATE TABLE IF NOT EXISTS `user`
(
    `id`        int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user_hash` varchar(255)    NOT NULL
);

CREATE TABLE IF NOT EXISTS `food`
(
    `id`   int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` varchar(255)    NOT NULL
);

CREATE TABLE IF NOT EXISTS `lunch_rating`
(
    `id`         int PRIMARY KEY                               NOT NULL AUTO_INCREMENT,
    `food_id`    int                                           NOT NULL,
    `rating`     float CHECK (rating >= 0.0 AND rating <= 5.0) NOT NULL,
    `lunch_date` date                                          NOT NULL,
    FOREIGN KEY (food_id) REFERENCES food (id)
);