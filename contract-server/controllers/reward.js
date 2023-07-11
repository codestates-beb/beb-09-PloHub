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
    //로그인
    if (reward_type === 1) {
      try {
        const senderAddress = varEnv.senderAddress;
        const receiverAddress = data.address;
        const tokenAmount = 1;

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
          return res.status(500).json({ error: "토큰 전송 실패!" });
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
      } catch (error) {
        console.log("보상 지급 중 오류 발생:", error);
        return res.status(500).json({ error: "보상 지급 중 오류 발생" });
      }
    }
    //게시물 작성
    if (reward_type === 2) {
      try {
        const senderAddress = varEnv.senderAddress;
        const receiverAddress = data.address;
        const tokenAmount = 3;

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
          return res.status(500).json({ error: "토큰 전송 실패!" });
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
      } catch (error) {
        console.log("보상 지급 중 오류 발생:", error);
        return res.status(500).json({ error: "보상 지급 중 오류 발생" });
      }
    }
    if (reward_type === 3) {
      try {
        const senderAddress = varEnv.senderAddress;
        const receiverAddress = data.address;
        const tokenAmount = 1;

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
          return res.status(500).json({ error: "토큰 전송 실패!" });
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
      } catch (error) {
        console.log("보상 지급 중 오류 발생:", error);
        return res.status(500).json({ error: "보상 지급 중 오류 발생" });
      }
    }else{
      console.log('reward type error!!');
      res.status(400).json({message: 'reward type error!'});
    }
  }
  catch(error){
    console.log(error);
    res.status(500).json({error: error});
  }
};
