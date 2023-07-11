const Web3 = require('web3');
const models = require("../models");
const varEnv = require("../config/var");

const updateTransaction = async (type) => {
  try {
    const web3 = new Web3(varEnv.rpcURL);

    // 최신 블록 번호 가져오기
    const latestBlockNumber = await web3.eth.getBlockNumber();

    // 최신 블록의 정보 가져오기
    const latestBlock = await web3.eth.getBlock(latestBlockNumber);

    // 최신 블록의 트랜잭션 목록 가져오기
    const transactions = latestBlock.transactions;

    // 가장 최신 트랜잭션 가져오기
    const latestTransactionHash = transactions[0]; // 최신 트랜잭션의 해시 값을 가져옵니다

    const latestTransaction = await web3.eth.getTransaction(latestTransactionHash);

    console.log(latestTransaction);

    const createTransaction = await models.transactions.create({
      hash: latestTransaction.hash,
      nonce: latestTransaction.nonce,
      blockHash: latestTransaction.blockHash,
      blockNumber: latestTransaction.blockNumber,
      transactionIndex: latestTransaction.transactionIndex,
      from: latestTransaction.from,
      to: latestTransaction.to,
      value: latestTransaction.value,
      gas: latestTransaction.gas,
      gasPrice: latestTransaction.gasPrice,
      input: latestTransaction.input,
      v: latestTransaction.v,
      r: latestTransaction.r,
      s: latestTransaction.s,
      status: "pending",
      type: type.toString()
    });

  } catch (error) {
    console.log(error);
  }
};

module.exports = updateTransaction;