const Web3 = require("web3");
const abiSource = require("../abi/ICToken.json");
const models = require("../models");
const varEnv = require("../config/var");
const updateTransaction = require('./UpdateTransaction');

exports.reward = async (req, res) => {
    try{
    const abi = abiSource.abi;

    const { user_id, reward_type } = req.body;
    const web3 = new Web3(varEnv.rpcURL);
    const contract = new web3.eth.Contract(abi, varEnv.contractAddress);

    const findWallet = await models.Wallets.findOne({
      where: { user_id: user_id },
    });

    if (!findWallet) {
      console.log("데이터 탐색 실패!");
      return res.status(400).json({ error: "데이터 탐색 실패!" });
    }

    const data = findWallet.dataValues;

    console.log("데이터 가져오기 성공. 보상을 지급합니다!");
    let tokenAmount;

    switch (reward_type) {
      case 1:
        tokenAmount = 1;
        break;
      case 2:
        tokenAmount = 3;
        break;
      case 3:
        tokenAmount = 1;
        break;
      default:
        return res.status(400).json({message: 'reward type error'});
    }

        const senderAddress = varEnv.senderAddress;
        const receiverAddress = data.address;

        const tokenBalance = await contract.methods
          .balanceOf(senderAddress)
          .call();
        if (parseInt(tokenBalance) < tokenAmount) {
          console.log("송신 계정의 토큰 잔액이 부족합니다!");
          return res
            .status(400)
            .json({ error: "송신 계정의 토큰 잔액이 부족합니다!" });
        }

        const allowance = await contract.methods
          .allowance(senderAddress, receiverAddress)
          .call();
        if (parseInt(allowance) < tokenAmount) {
          const approveResult = await contract.methods
            .approve(receiverAddress, tokenAmount)
            .send({ from: senderAddress });
          if (!approveResult.status) {
            console.log("토큰 전송 권한 부여 실패!");
            return res.status(500).json({ error: "토큰 전송 권한 부여 실패!" });
          }
        }

        

        const transferResult = await contract.methods
          .transferFrom(senderAddress, receiverAddress, tokenAmount)
          .send({ from: senderAddress });
        if (!transferResult.status) {
          console.log("토큰 전송 실패!");
          return res.status(400).json({ error: "토큰 전송 실패!" });
        }

        updateTransaction("token");
        const updatedTokenBalance = await contract.methods
          .balanceOf(receiverAddress)
          .call();

        const updateWallet = await models.Wallets.update(
          { token_amount: updatedTokenBalance, eth_amount: data.eth_amount },
          {
            where: {
              user_id: user_id,
            },
          }
        );

        console.log(updateWallet);
        res.status(200).json({
          reward_amount: tokenAmount,
          token_amount: updatedTokenBalance,
        });
    }catch(error){
    console.log(error);
    return res.status(500).json({error: error});
  }
};
