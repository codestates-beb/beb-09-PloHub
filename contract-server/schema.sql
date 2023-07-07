CREATE TABLE `wallets` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int UNIQUE NOT NULL,
  `address` varchar(255) NOT NULL,
  `encrypted_private_key` varchar(255) NOT NULL,
  `eth_amount` int DEFAULT (0),
  `token_amount` int DEFAULT (0),
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp DEFAULT (now())
);

CREATE TABLE `nfts` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `owner_address` varchar(255) NOT NULL,
  `token_id` int NOT NULL,
  `token_uri` varchar(255) NOT NULL,
  `price` uint DEFAULT (0),
  `created_at` timestamp DEFAULT (now()),
  `updated_at` timestamp DEFAULT (now())
);

ALTER TABLE `nfts` ADD FOREIGN KEY (`owner_address`) REFERENCES `wallets` (`address`);

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql -p -Dcmarket
 *  to create the database and the tables.*/