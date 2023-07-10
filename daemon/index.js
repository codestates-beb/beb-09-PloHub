const cron = require("node-cron");
const models = require("../contract-server/models");
const Web3 = require("web3");
const varEnv = require('../contract-server/config/var');
const web3 = new Web3(varEnv.rpcURL);


// 데몬 구현 위해서 walletsDaemon, nftsDaemon 스키마 생성 후 테이블 생성 -> daemon.js 작성

// 트랜잭션이 일어날 때 마다 controller에서 transaction 테이블에 트랜잭션 저장(type = wallets, nfts로 나눠서 데몬 실행 후 tpye을 확인 후 tpye에 맞는 데이터 베이스에 저장)

// 사용자의 지갑 주소나 ERC20 or ERC721 컨트랙트 주소를 포함한 트랜잭션만 골라서 저장, ERC20 거래는 walletsDaemon에 ERC721거래는 nftsDaemon에 저장

// 그리고 데몬을 실행하면 1초마다 데이터 베이스를 탐색(status: pending인 것만 다 찾아와서 하나하나 type 비교 후 맞는 데이터 베이스에 저장)


// 최신블록넘버 조회
const getLatestBlock = async () => {
	return await web3.eth.getBlockNumber();
}

// 매 초마다 실행
const task = cron.schedule(
	"* * * * * *",
	async () => {
		const recentBlock = await web3.eth.getBlockNumber(); // 최근 블록 넘버를 주기적으로 받아옴
        if(getLatestBlock != recentBlock) { // 최근 블록을 조회했을 때 기존 블록 넘버와 다르다면 : 새로운 트랜잭션 발생이기 때문에 작동
            const recentTx = await web3.eth.getBlock(recentBlock) //블록정보
            .then((blockInfo) => {
				console.log(blockInfo.transactions[0]);
                return blockInfo.transactions[0] // 블록안 Tx 정보 : ganache의 경우 한 블록에 트랜잭션 하나라 0번째 가져옴
            })
            var txInfo = await web3.eth.getTransaction(recentTx); // 트랜잭션 정보 가져오기
            console.log(txInfo)   

            getLatestBlock = recentBlock; // 기존 블록 업데이트
		}
	},
	{
		scheduled: true,
	}
);

task.start();