CREATE TABLE `contact` (
                           `idx` int(11) NOT NULL AUTO_INCREMENT,
                           `name` varchar(45) DEFAULT NULL,
                           `phone` varchar(45) DEFAULT NULL,
                           `email` varchar(45) DEFAULT NULL,
                           `memo` text,
                           `regdate` varchar(20) DEFAULT NULL,
                           PRIMARY KEY (`idx`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


CREATE TABLE `member` (
                          `idx` int(11) NOT NULL AUTO_INCREMENT,
                          `user_id` varchar(45) DEFAULT NULL,
                          `pw` varchar(255) DEFAULT NULL,
                          `name` varchar(45) DEFAULT NULL,
                          PRIMARY KEY (`idx`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

INSERT INTO `member` (user_id,pw,name) VALUES ('test','1234','임시');