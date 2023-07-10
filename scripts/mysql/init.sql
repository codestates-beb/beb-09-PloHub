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


 CREATE TABLE transactions (
    hash VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    blockHash VARCHAR(255) DEFAULT "",
    blockNumber INT DEFAULT 0 PRIMARY KEY,
    transactionIndex INT DEFAULT 0,
    `from` VARCHAR(255) NOT NULL,
    `to` VARCHAR(255) NOT NULL,
    value VARCHAR(255),
    gas INT,
    gasPrice VARCHAR(255) NOT NULL,
    input VARCHAR(500),
    v VARCHAR(255),
    r VARCHAR(255),
    s VARCHAR(255),
    status VARCHAR(255),
    type VARCHAR(255)
);

 CREATE TABLE ethTransactions (
    hash VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    blockHash VARCHAR(255) DEFAULT "",
    blockNumber INT DEFAULT 0 PRIMARY KEY,
    transactionIndex INT DEFAULT 0,
    `from` VARCHAR(255) NOT NULL,
    `to` VARCHAR(255) NOT NULL,
    value VARCHAR(255),
    gas INT,
    gasPrice VARCHAR(255) NOT NULL,
    input VARCHAR(255),
    v VARCHAR(255),
    r VARCHAR(255),
    s VARCHAR(255),
    status VARCHAR(255),
    type VARCHAR(255)
);


 CREATE TABLE tokenTransactions (
    hash VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    blockHash VARCHAR(255) DEFAULT "",
    blockNumber INT DEFAULT 0 PRIMARY KEY,
    transactionIndex INT DEFAULT 0,
    `from` VARCHAR(255) NOT NULL,
    `to` VARCHAR(255) NOT NULL,
    value VARCHAR(255),
    gas INT,
    gasPrice VARCHAR(255) NOT NULL,
    input VARCHAR(255),
    v VARCHAR(255),
    r VARCHAR(255),
    s VARCHAR(255),
    status VARCHAR(255),
    type VARCHAR(255)
);

 CREATE TABLE nftTransactions (
    hash VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    blockHash VARCHAR(255) DEFAULT "",
    blockNumber INT DEFAULT 0 PRIMARY KEY,
    transactionIndex INT DEFAULT 0,
    `from` VARCHAR(255) NOT NULL,
    `to` VARCHAR(255) NOT NULL,
    value VARCHAR(255),
    gas INT,
    gasPrice VARCHAR(255) NOT NULL,
    input VARCHAR(500),
    v VARCHAR(255),
    r VARCHAR(255),
    s VARCHAR(255),
    status VARCHAR(255),
    type VARCHAR(255)
);