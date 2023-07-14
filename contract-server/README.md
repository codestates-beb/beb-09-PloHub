# PLOHUB contract-server / contract / daemon

* **contract-server :** main-server에서 넘어오는 요청들을 컨트랙트, IPFS, mysql을 이용해 처리 후 다시 main-server에 결과 반환
* **contract :** 스마트 컨트랙트 작성, 관리 및 배포
* **daemon :** 트랜잭션 추적 및 데이터 베이스에 저장

- - - 
## 💻 Stack 💻
Solidity Node.js express Ganache web3.js mysql pinata truffle
- - -
## 아키텍쳐, 구성요소
![](https://velog.velcdn.com/images/psh03225/post/2f3a228b-e27f-4637-bc7f-a63ba857c4d2/image.png)

* **contract-server** : main-server에서 받은 정보들로 여러 블록체인 관련 기능 처리 후 main-server에 반환
* **Ganache** : Private network를 구축해서 모든 트랜잭션 및 블록 저장, 100ETH를 보유한 지갑 10개로 충분한 테스트 및 이더, 토큰 지급 가능
* **userWallet** : 사용자 지갑으로 회원가입 시 자동으로 각 사용자에게 지갑을 생성 후 지급합니다 
* **serverWallet** : 2개 존재, 1개는 ethFaucet용 지갑, 1개는 서버지갑(토큰 지급 및 각종 트랜잭션 전송)
* **mySql** : contract-server 데이터 베이스, Wallet,NFT 정보 저장
* **deployedContract** : truffle로 배포 후 abi 코드로 컨트랙트 객체 생성
* **Pinata** : NFT metadata 저장 및 tokenURI 반환
* **Daemon** : 트랜잭션 추적 및 저장
- - -
## 기능
**1. createWallet** : main-server에서 중복 확인 후 회원가입 정보를 넘겨주면 사용자 지갑 생성, ethFaucet, 회원가입 보상 토큰 지급
![](https://velog.velcdn.com/images/psh03225/post/10529031-a52a-4050-ba52-6cb66a32b265/image.png)

---

**2. reward** : 게시물 작성, 일일 로그인 보상, 댓글 작성과 같은 커뮤니티 활동에 대한 보상을 지급(reward_type 0=회원가입 1=로그인 보상 2=게시물 작성 보상)
![](https://velog.velcdn.com/images/psh03225/post/32a18f0a-2eb3-4e3c-b6b7-f1fdc7fe48c6/image.png)
![](https://velog.velcdn.com/images/psh03225/post/7d6de5e2-d3c6-408a-bba9-f002e2340eb5/image.png)

---

**3. mintNFT** : 활동 및 보상으로 받은 토큰들로 자신만의 NFT를 발행 가능. 커뮤니티 취지상 활동사진, 깨끗한 거리, 환경과 관련된 내용의 NFT 발행 권장, 하지만 이와 무관한 내용이여도 상관 없음
![](https://velog.velcdn.com/images/psh03225/post/2d4dca85-ba6e-440b-a8bf-f0f2005843a6/image.png)

---

**4. nftDetail** : 선택한 nft(token_id)의 상세정보를 main-server에 돌려준다
![](https://velog.velcdn.com/images/psh03225/post/1894e9fc-5f31-4f3d-8fdf-314ac9f0b566/image.png)

---

**5. userNFT** : 사용자가 민팅하거나 보유한 NFT정보를 반환한다

![](https://velog.velcdn.com/images/psh03225/post/ae99f40b-7a49-490e-b94b-1de80c984974/image.png)

---

**6. tokenTransfer** : user간 토큰 교환이 가능하다
![](https://velog.velcdn.com/images/psh03225/post/daba2d3c-0144-4bee-8842-9769dd486200/image.png)

---

**7. tokenSwap** : 보유한 토큰을 ETH로 교환할 수 있다.(단, **ETH는 토큰으로 교환 불가능하다 왜냐하면 커뮤니티 활동 더욱 장려하기 위해 토큰은 오로지 커뮤니티 활동으로만 얻을 수 있다**) 1Token === 0.001ETH
![](https://velog.velcdn.com/images/psh03225/post/85e458b7-7059-41c5-aaf4-f92113732c98/image.png)

**8. NFTlist** : 발행되어있는 전체 NFT를 가져온다
![](https://velog.velcdn.com/images/psh03225/post/0b065de3-9ac8-41a5-a2ca-b854bd36f902/image.png)

---

## Daemon
**실행 순서**
1. 트랜잭션이 생성된 순간 해당 트랜잭션을 web3객체를 이용해 가져옴
2. 해당 트랜잭션의 정보와 status:pending, type: 거래 내용(eth, token, nft)를 데이터 베이스에 저장
3. 데몬 실행 시 status가 pending인것만 가져온 후 type에 맞는 테이블에 저장
4. 분류 완료한 트랜잭션 정보의 status를 complete으로 업데이트(이미 추적 및 저장한 트랜잭션은 다시 추적 및 저장할 필요 없기 때문)

* **위 과정을 pm2, node-cron을 사용해서 10초 마다 백그라운드에서 자동 실행**
* **watch 옵션으로 해당 과정들을 모니터링하며 문제 발생 시 해결**
---


트랜잭션 발생 시 추적 후 데이터 베이스 저장
![](https://velog.velcdn.com/images/psh03225/post/4e55ce06-83ec-4f4b-80e0-568f153e5e36/image.png)

---
데몬 실행시 데이터 베이스에서 status:pending인 데이터들을 추적 후 type에 맞는 테이블에 저장
![](https://velog.velcdn.com/images/psh03225/post/60cb3f8b-3910-4804-b7ad-fc6336eca50b/image.png)

---
저장된 모습
![](https://velog.velcdn.com/images/psh03225/post/ec96d059-cfad-45e1-9561-68f33b939d0e/image.png)
![](https://velog.velcdn.com/images/psh03225/post/3485be15-fec7-42b2-9e02-0c563cc10234/image.png)
![](https://velog.velcdn.com/images/psh03225/post/3ed9bb73-4c24-4fbc-b9a3-ed03c94c20cf/image.png)
