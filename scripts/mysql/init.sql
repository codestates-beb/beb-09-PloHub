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
  name varchar(255) NOT NULL,
  description varchar(255) NOT NULL,
  image varchar(255) NOT NULL,
  created_at timestamp DEFAULT now()
);

 CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hash VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    blockHash VARCHAR(255) DEFAULT "",
    blockNumber INT DEFAULT 0,
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

 CREATE TABLE ethTransaction (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hash VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    blockHash VARCHAR(255) DEFAULT "",
    blockNumber INT DEFAULT 0,
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


 CREATE TABLE tokenTransaction (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hash VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    blockHash VARCHAR(255) DEFAULT "",
    blockNumber INT DEFAULT 0,
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

 CREATE TABLE nftTransaction (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hash VARCHAR(255) NOT NULL,
    nonce VARCHAR(255) NOT NULL,
    blockHash VARCHAR(255) DEFAULT "",
    blockNumber INT DEFAULT 0,
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


ALTER TABLE nfts ADD FOREIGN KEY (user_id) REFERENCES wallets (user_id);