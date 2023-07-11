const Web3 = require('web3');
const abiSource = require('../abi/ICToken.json');
const models = require('../models');
const varEnv = require('../config/var');
const updateTransaction = require('./UpdateTransaction');

exports.transferToken = async (req,res) => {
    try{
        const {sender_id, receiver_id, token_amount} = req.body   

        const sender = await models.Wallets.findOne({
            where: {
                user_id: sender_id
            }
        })
        const senderAddress = sender.address;

        const receiver = await models.Wallets.findOne({
            where: {
                user_id: receiver_id
            }
        })

        const receiverAddress = receiver.address;

        const abi = abiSource.abi;

        const web3 = new Web3(varEnv.rpcURL);

        const contract = new web3.eth.Contract(abi,varEnv.contractAddress);


        // 사용자 지갑과 컨트랙트 객체 연결
        const userWallet = web3.eth.accounts.privateKeyToAccount(
        sender.private_key
        );
        const connectedContract = contract.clone();
        connectedContract.setProvider(web3.currentProvider);
        // connectedContract.options.address = varEnv.erc721ContractAddress;
        connectedContract.options.from = userWallet.address;

        // 트랜잭션 서명을 위한 지갑 설정
        web3.eth.accounts.wallet.add(userWallet);
        

        const allowance = await contract.methods.allowance(senderAddress, receiverAddress).call();
        if (parseInt(allowance) < token_amount) {
            const approveResult = await contract.methods.approve(receiverAddress, token_amount).send({ from: senderAddress, gas: 3000000});
            if (!approveResult.status) {
                console.log('토큰 전송 권한 부여 실패!');
                return res.status(500).json({ error: '토큰 전송 권한 부여 실패!' });
            }
        }
        console.log('토큰 전송 권한 부여 성공!');
        console.log(await web3.eth.getBalance(varEnv.senderAddress));

        const transferResult = await contract.methods.transferFrom(senderAddress, receiverAddress, token_amount).send({ from: senderAddress, gas: 3000000 });
        if (!transferResult.status) {
            console.log('토큰 전송 실패!');
            return res.status(500).json({ error: '토큰 전송 실패!' });
        }else{
            updateTransaction("token");
            console.log("토큰 전송 성공!")
            const senderBalance = await contract.methods.balanceOf(senderAddress).call();
            const senderEthBalance = web3.utils.fromWei(await web3.eth.getBalance(senderAddress), 'wei');
            const receiverBalance = await contract.methods.balanceOf(receiverAddress).call();


            //지갑 연결 해제
            web3.eth.accounts.wallet.remove(userWallet);
            //데이터 베이스 최신화!
            const senderDataUpdate = await models.Wallets.update({token_amount: senderBalance, eth_amount: senderEthBalance}, {
                where : {
                    user_id: sender_id
                }
            });

            const receiverDataUpdate = await models.Wallets.update({token_amount: receiverBalance},{
                where: {
                    user_id : receiver_id
                }
            });

            console.log(senderBalance);
            console.log(receiverBalance);

            return res.status(200).json({message: 'OK', sender_balance: senderBalance, sender_eth_balance: senderEthBalance, receiver_balance: receiverBalance});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({error: error});
    }
}