const Web3 = require("web3");
const abiSource = require("../abi/ICToken.json");
const models = require("../models");
const varEnv = require("../config/var");
const updateTransaction = require('./UpdateTransaction');

// 회원가입 처리 함수
exports.createWallet = async (req, res) => {
  try {
    const abi = abiSource.abi; // ERC-20 abi code

    // Ethereum 네트워크에 연결
    const web3 = new Web3(varEnv.rpcURL); // Ganache URL

    // 컨트랙트 객체 생성
    const contract = new web3.eth.Contract(abi, varEnv.contractAddress);

    // 회원가입에 필요한 정보 수집
    const { user_id } = req.body;

    // Ethereum 지갑 생성
    const wallet = await web3.eth.accounts.create();
    const walletAddress = wallet.address;
    console.log(wallet);

    // ETH faucet 기능 추가
    const faucetAmount = web3.utils.toWei("0.1", "ether"); // ETH faucet에서 보낼 금액 (0.1 ETH)
    const gasPrice = web3.utils.toHex(100 * 10 ** 9); // 예시: 100 Gwei
    const gasLimit = web3.utils.toHex(21000); // 예시: 21000

    const faucetTransaction = {
      from: varEnv.faucetSender,
      to: walletAddress,
      value: faucetAmount,
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
    };

    const signedFaucetTransaction = await web3.eth.accounts.signTransaction(
      faucetTransaction,
      varEnv.faucetSenderPrivate
    );

    const faucetReceipt = await web3.eth.sendSignedTransaction(
      signedFaucetTransaction.rawTransaction
    );
    if (faucetReceipt) {
      console.log("ETH faucet 성공!!");
    } else {
      console.log("ETH faucet 실패!!");
    }

    updateTransaction("eth");

    // // 응답할 eth_amount, token_amount
    const eth_amount = web3.utils.fromWei(
      await web3.eth.getBalance(walletAddress),
      "wei"
    );
    const token_amount = 5;

    // ERC20 토큰 전송(회원가입 보상)
    const senderAddress = varEnv.senderAddress;
    const receiverAddress = walletAddress;

    const approveResult = await contract.methods
      .approve(receiverAddress, token_amount)
      .send({ from: senderAddress });
    if (!approveResult.status) {
      console.log("토큰 전송 권한 부여 실패!");
      return res.status(500).json({ error: "토큰 전송 권한 부여 실패!" });
    }

    updateTransaction("token");

    const transferResult = await contract.methods
      .transferFrom(senderAddress, receiverAddress, token_amount)
      .send({ from: senderAddress });
    if (!transferResult.status) {
      console.log("토큰 전송 실패!");
      return res.status(500).json({ error: "error!!" });
    }

    updateTransaction('token');

    const createdWallet = await models.Wallets.create({
      user_id: user_id,
      address: walletAddress,
      private_key: wallet.privateKey,
      eth_amount: eth_amount,
      token_amount: token_amount,
    });
    console.log(createdWallet);

    res.status(200).json({
      message: "OK",
      address: walletAddress,
      token_amount: token_amount.toString(),
      eth_amount: eth_amount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
