const cron = require("node-cron");
const models = require("../contract-server/models");
const Web3 = require("web3");
const varEnv = require('../contract-server/config/var');
const web3 = new Web3(varEnv.rpcURL);
const connectDB = require('./loaders/connectDB');

connectDB;

// 매 초마다 실행
const task = cron.schedule(
	"* * * * * *",
	async () => {
		const transactions = await models.transactions.findAll({
			where: {
				status: "pending"
			}
		})

		const transactionData = transactions.map(item => item.dataValues);

		for (tx of transactionData){
			if (tx.type === 'token'){
				//상태 complete으로 변경				
				await models.tokenTransaction.create({
					hash: tx.hash,
					nonce: tx.nonce,
					blockHash: tx.blockHash,
					blockNumber: tx.blockNumber,
					transactionIndex: tx.transactionIndex,
					from: tx.from,
					to: tx.to,
					value: tx.value,
					gas: tx.gas,
					gasPrice: tx.gasPrice,
					input: tx.input,
					v: tx.v,
					r: tx.r,
					s: tx.s,
					status: "complete",
					type: tx.type
				})
			}else if (tx.type === 'eth'){	
				await models.ethTransaction.create({
					hash: tx.hash,
					nonce: tx.nonce,
					blockHash: tx.blockHash,
					blockNumber: tx.blockNumber,
					transactionIndex: tx.transactionIndex,
					from: tx.from,
					to: tx.to,
					value: tx.value,
					gas: tx.gas,
					gasPrice: tx.gasPrice,
					input: tx.input,
					v: tx.v,
					r: tx.r,
					s: tx.s,
					status: "complete",
					type: tx.type
				})
			}else if (tx.type === 'nft'){
				await models.nftTransaction.create({
					hash: tx.hash,
					nonce: tx.nonce,
					blockHash: tx.blockHash,
					blockNumber: tx.blockNumber,
					transactionIndex: tx.transactionIndex,
					from: tx.from,
					to: tx.to,
					value: tx.value,
					gas: tx.gas,
					gasPrice: tx.gasPrice,
					input: tx.input,
					v: tx.v,
					r: tx.r,
					s: tx.s,
					status: "complete",
					type: tx.type
				})
			}else{
				console.log('dataType error!');
			}
		}

	},
	{
		scheduled: true,
	},
	console.log(findTransaction)
);

task.start();