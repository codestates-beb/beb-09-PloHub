const Web3 = require('web3');
const crypto = require('crypto');
const abiSource = require('../../CONTRACT/build/contracts/ICToken.json');
const models = require('../models');
const sequelize = require('sequelize');
require('dotenv').config();

// 회원가입 처리 함수
exports.createWallet = async (req, res) => {
  try {
    const abi = abiSource.abi; // ERC-20 abi code

    // Ethereum 네트워크에 연결
    const web3 = new Web3('http://127.0.0.1:7545'); // Ganache URL

    // 컨트랙트 주소 설정
    const contractAddress = process.env.ERC20_CONTRACT_ADDRESS;

    // 컨트랙트 객체 생성
    const contract = new web3.eth.Contract(abi, contractAddress);

    // 회원가입에 필요한 정보 수집
    const { user_id, email } = req.body;

    // Ethereum 지갑 생성
    const wallet = await web3.eth.accounts.create();
    const walletAddress = wallet.address;
    console.log(wallet);

    // 개인 키 암호화
    // const encrypted_private_key = encryptPrivateKey(wallet.privateKey, email);

    // ETH faucet 기능 추가
    const faucetAmount = web3.utils.toWei('0.1', 'ether'); // ETH faucet에서 보낼 금액 (1 ETH)
    const faucetSender = process.env.FAUCET_SENDER; // ETH faucet의 발신자 주소
    const faucetSenderPrivate = process.env.FAUCET_SENDER_PRIVATE;
    const gasPrice = web3.utils.toHex(100 * 10**9); // 예시: 100 Gwei
    const gasLimit = web3.utils.toHex(21000); // 예시: 21000

    const faucetTransaction = {
        from: faucetSender,
        to: walletAddress,
        value: faucetAmount,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit)
    };

    const signedFaucetTransaction = await web3.eth.accounts.signTransaction(faucetTransaction, faucetSenderPrivate);

    const faucetReceipt = await web3.eth.sendSignedTransaction(signedFaucetTransaction.rawTransaction);
    if (faucetReceipt) {
        console.log("ETH faucet 성공!!");
    }else{
        console.log("ETH faucet 실패!!");
    }

    //응답할 eth_amount, token_amount
    const eth_amount = web3.utils.fromWei(await web3.eth.getBalance(walletAddress), 'ether');
    console.log(eth_amount);
    const token_amount = 5;

    const senderAddress = process.env.SENDER; // 발신자 주소 설정

    
    // ERC20 토큰 전송(회원가입 보상)
    const result = await contract.methods.transfer(walletAddress,5).send({from: senderAddress});
    console.log(result);
    contract.methods.balanceOf(walletAddress).call()
        .then((result)=> {
            console.log(`새로 생성된 지갑 ${walletAddress}의 토큰 잔액 : ${result}`);
        })
    

    
    console.log("지갑 생성 후 회원가입 보상 트랜잭션 전송 중.....");

    // 전송 트랜잭션 결과 확인
    if (result) {
      // 사용자 정보 데이터베이스에 저장
      const createdWallet = await models.Wallets.create({
        user_id: user_id,
        address: walletAddress,
        encrypted_private_key: wallet.privateKey,
        eth_amount: eth_amount,
        token_amount: token_amount,
      });
      console.log(createdWallet)
      res.status(200).json({ success: '회원가입 성공!' });
    } else {
      // 회원가입 실패 응답
      res.status(500).json({ error: '회원가입에 실패했습니다.' });
    }
  } catch (error) {
    // 회원가입 실패 응답
    console.error(error);
    res.status(500).json({ error: '회원가입에 실패했습니다.' });
  }
};



