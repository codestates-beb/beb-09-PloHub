//토큰 스왑 방식
//토큰을 이더로 교환할 지갑에서 토큰을 꺼내서 서버 계좌로 보내줌
//서버 계좌에서는 토크을 보낸 지갑으로 해당하는 비율 만큼 이더를 보내준다
//이더를 전송하고 토큰으로 받는 것은 X, 토큰은 오직 활동을 통해서만 받을 수 있다!

// 1. 사용자 지갑 -> 서버 지갑 토큰 전송
// if 토큰 전송이 완료된다면 
// 2. 서버 지갑 -> 사용자 지갑 ETH전송
// 3. ETH 전송 완료되면 데이터베이스 최신화
// 4. main-server로 바뀐 사용자 토큰수량, ETH수량 전송
const Web3 = require('web3');
const abiSource = require('../abi/ICToken.json');
const models = require('../models');
const varEnv = require('../config/var');

exports.tokenSwap = async (req,res) => {
    const {user_id, token_amount} = req.body

    const abi = abiSource.abi;

    const web3 = new Web3(varEnv.rpcURL);

    const contract = new web3.eth.Contract(abi,varEnv.contractAddress);
    
    const sender = await models.Wallets.findOne({
        where : {
            user_id: user_id
        }
    });

    const senderAddress = sender.address;

    // 사용자 지갑과 컨트랙트 객체 연결
    const userWallet = web3.eth.accounts.privateKeyToAccount(
    sender.private_key
    );
    const connectedContract = contract.clone();
    connectedContract.setProvider(web3.currentProvider);
    // connectedContract.options.address = varEnv.erc721ContractAddress;
    connectedContract.options.from = senderAddress;

    // 트랜잭션 서명을 위한 지갑 설정
    web3.eth.accounts.wallet.add(userWallet);
    // 사용자 지갑에서 서버 계좌로 보낼 수 있는 토큰 한도 확인
    const allowance = await contract.methods.allowance(senderAddress,varEnv.senderAddress);
    if (parseInt(allowance)< token_amount){
        const approveResult = await contract.methods.approve(varEnv.contractAddress).send({from : senderAddress});
        if (!approveResult){
            console.log('토큰 전송 권한 부여 실패!');
            return res.status(500).json({error: '토큰 전송 권한 부여 실패!'});
        }
    }
    console.log('토큰 전송 권한 부여 성공!');

    // 토큰 전송
    const tokenTransferResult = await contract.methods.transFrom(senderAddress,varEnv.senderAddress).send({from: senderAddress});
    if (!tokenTransferResult){
        console.log('토큰 전송 실패!');
        return res.status(500).json({error: '토큰 전송 실패!'});
    }

    console.log('토큰 전송 성공!');

    //서버 계좌에서 사용자 지갑으로 ETH전송(create 부분 ETH faucet과 같은 방식으로 전송)
    // 1token당 0.001ETH
    const eth_amount = token_amount/1000;
    console.log(eth_amount);

    const faucetAmount = web3.utils.toWei(eth_amount.toString(), "ether"); // ETH faucet에서 보낼 금액 (0.1 ETH)
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
}