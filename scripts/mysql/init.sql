CREATE TABLE wallets (
  id int PRIMARY KEY AUTO_INCREMENT,
  user_id int UNIQUE NOT NULL,
  address varchar(255) NOT NULL,
  private_key varchar(255) NOT NULL,
  eth_amount decimal(20,0) DEFAULT 0,
  token_amount decimal(20,0)  DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE nfts (
  id int PRIMARY KEY AUTO_INCREMENT,
  user_id int  NOT NULL,
  owner_address varchar(255) NOT NULL,
  token_id int NOT NULL,
  token_uri varchar(255) NOT NULL,
  price decimal(20,0) DEFAULT 0,
  created_at timestamp DEFAULT now()
);

ALTER TABLE nfts ADD FOREIGN KEY (user_id) REFERENCES wallets (user_id);

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql -p -Dcmarket
 *  to create the database and the tables.*/