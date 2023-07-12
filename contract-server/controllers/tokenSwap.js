const Web3 = require('web3');
const abiSource = require('../abi/ICToken.json');
const models = require('../models');
const varEnv = require('../config/var');
const updateTransaction = require('./UpdateTransaction');

exports.tokenSwap = async (req,res) => {
    try{
        const {user_id, token_amount} = req.body

        const abi = abiSource.abi;

        const web3 = new Web3(varEnv.rpcURL);

        const contract = new web3.eth.Contract(abi,varEnv.contractAddress);
        
        const sender = await models.Wallets.findOne({
            where : {
                user_id: user_id
            }
        });

        if (!sender) {
            return res.status(400).json({message: 'Invalid userId'});
        }

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
            const approveResult = await contract.methods.approve(varEnv.contractAddress).send({from : senderAddress,gas: 3000000});
            if (!approveResult){
                console.log('토큰 전송 권한 부여 실패!');
                return res.status(500).json({error: '토큰 전송 권한 부여 실패!'});
            }
        }
        console.log('토큰 전송 권한 부여 성공!');

        // 토큰 전송
        const tokenTransferResult = await contract.methods.transferFrom(senderAddress,varEnv.senderAddress,token_amount).send({from: senderAddress,gas: 3000000});
        if (!tokenTransferResult){
            console.log('토큰 전송 실패!');
            return res.status(500).json({error: '토큰 전송 실패!'});
        }
        
        updateTransaction("token");

        console.log('토큰 전송 성공!');

        //서버 계좌에서 사용자 지갑으로 ETH전송(create 부분 ETH faucet과 같은 방식으로 전송)
        // 1token당 0.001ETH
        const eth_amount = token_amount/1000;
        console.log(eth_amount);

        const transferETHAmount = web3.utils.toWei(eth_amount.toString(), "ether"); // ETH faucet에서 보낼 금액 (0.1 ETH)
        const gasPrice = web3.utils.toHex(100 * 10 ** 9); // 예시: 100 Gwei
        const gasLimit = web3.utils.toHex(21000); // 예시: 21000

        const ethTransferTransaction = {
        from: varEnv.senderAddress,
        to: senderAddress,
        value: transferETHAmount,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        };

        const signedTransferTransaction = await web3.eth.accounts.signTransaction(
        ethTransferTransaction,
        varEnv.senderPrivate
        );

        const ethTransferReceipt = await web3.eth.sendSignedTransaction(
        signedTransferTransaction.rawTransaction
        );
        if (ethTransferReceipt) {
            updateTransaction(req,res,"eth");
        console.log("ETH transfer 성공!!");
        } else {
        console.log("ETH transfer 실패!!");
        return res.status(400).json({message: 'failed ETH transfer'});
        }

        //데이터 베이스 최신화
        const currentTokenAmount = await contract.methods.balanceOf(senderAddress).call();
        const currentETHAmount = web3.utils.fromWei(await web3.eth.getBalance(senderAddress), 'wei');

        const updateUserWallet = await models.Wallets.update({token_amount: currentTokenAmount, eth_amount: currentETHAmount},{
            where : {
                user_id: user_id
            }
        })
        if (!updateUserWallet){
            console.log('데이터 베이스 업데이트 실패');
            return res.status(500).json({message: 'update failed'});
        }

        return res.status(200).json({message: 'OK', token_amount: currentTokenAmount, eth_amount: currentETHAmount});
    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
}