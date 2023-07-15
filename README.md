# 🏃‍♀️ PloHub

플로깅(조깅을 하면서 쓰레기를 줍는 행위)을 좋아하는 사람들이 행사 정보, 코스 정보, 참여 후기 등의 기록을 공유할 수 있는 인센티브 기반 커뮤니티 서비스

## 🎪 Team

| 이름   | 역할 | 담당                                    |
| ------ | ---- | --------------------------------------- |
| 이효확 | 팀장 | main-server, docker setup               |
| 김서연 | 팀원 | client                                  |
| 박상현 | 팀원 | smart contract, contract-server, daemon |

## 📝 Documents

- [Team Notion](https://www.notion.so/Project-2-PloHub-BEB-09-Block-Panther-c8831e75e3ec457794d0b72bab9b4672)

> If you want to see more details, please visit our notion page

## 📚 Stack

### Client

<img src="https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/NEXT.JS-000000?style=for-the-badge&logo=next.js&logoColor=white"> <img src="https://img.shields.io/badge/AXIOS-5A29E4?style=for-the-badge&logo=axios&logoColor=white"> <img src="https://img.shields.io/badge/REDUX-764ABC?style=for-the-badge&logo=redux&logoColor=white"> <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=tailwind css&logoColor=white">

### Main Server

<img src="https://img.shields.io/badge/GO-00ADD8?style=for-the-badge&logo=go&logoColor=white"> <img src="https://img.shields.io/badge/jsonwebtokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"> <img src="https://img.shields.io/badge/AMAZON S3-569A31?style=for-the-badge&logo=amazon s3&logoColor=white"> <img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white">

### Contract Server

<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"> <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/web3.js-F16822?style=for-the-badge&logo=web3.js&logoColor=white"> <img src="https://img.shields.io/badge/sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white"> <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> <img src="https://img.shields.io/badge/pinata-000000?style=for-the-badge&logo=pinata&logoColor=white">

### Daemon

<img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=pm2&logoColor=white">

### Smart Contract & Blockchain

<img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white"> <img src="https://img.shields.io/badge/Truffle-363636?style=for-the-badge&logo=truffle&logoColor=white"> <img src="https://img.shields.io/badge/Ganache-363636?style=for-the-badge&logo=ganache&logoColor=white">

### Infra (Test)

<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">

## 🛒 Requirements

- node v16.14.0
- npm v9.4.0
- go v1.20.0 (optional)
- docker
- aws access key & secret key (grant s3 full access)
- pinata api key & secret key

## 🐳 Run on Docker Compose

### 1. create config files from template (.example files)

- `client/.env`
- `main-server/config/config.docker.json`
- `contract-server/.env`
- `contract-server/src/config/config.json`
- `daemon/src/config/config.json`

### 2. Run ganache and deploy contracts

```bash
$ docker compose up -d ganache
$ cd contract && npm i && npx truffle migrate --network docker
```

> copy and paste deployed contract addresses to `contract-server/.env`

### 3. Run docker compose

```bash
$ docker compose up -d
```

### 4. Run client

```bash
$ cd client && npm i && npm run dev
```
