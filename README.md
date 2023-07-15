# PloHub

- 플로깅(조깅을 하면서 쓰레기를 줍는 행위)을 좋아하는 사람들이 행사 정보, 코스 정보, 참여 후기 등의 기록을 공유할 수 있는 인센티브 기반 커뮤니티 서비스

## Requirements

- node v16.14.0
- npm v9.4.0
- go v1.20.0 (optional)
- docker
- aws access key & secret key (grant s3 full access)
- pinata api key & secret key

## Running on Docker Compose

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
