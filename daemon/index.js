const cron = require("node-cron");
const models = require("./models");
const transactionModel = require("../contract-server/models");
// const Web3 = require("web3");
// const web3 = new Web3("http://ganache:8545");
const connectDB = require('./loaders/connectDB');


connectDB;

// 매 초마다 실행
cron.schedule(
	"*/10 * * * * *",
	async () => {
		const transactions = await transactionModel.transactions.findAll({
			where: {
				status: "pending"
			}
		})
		
		const transactionData = transactions.map(item => item.dataValues);

		for (tx of transactionData){
			console.log(tx);
			transactionModel.transactions.update({status: "complete"},{
				where: {
					blockNumber: tx.blockNumber
				}
			});
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
				});
			}
			else if (tx.type === 'eth'){	
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
			}
			else if (tx.type === 'nft'){
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
);