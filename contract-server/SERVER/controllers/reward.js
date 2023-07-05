const Web3 = require('web3');
const abiSource = require('../../contract/build/contracts/ICToken.json');
const models = require('../models');
const varEnv = require('../config/var');

exports.reward = async (req, res) => {
    const abi = abiSource.abi;

    const {user_id, email, reward_type} = req.body;
    const web3 = new Web3('http://127.0.0.1:7545');
    const contract = new web3.eth.Contract(abi, varEnv.contractAddress);

    const findWallets = await models.Wallets.findOne({
        where : {user_id : user_id}
    });

    // if (findWallets) {
    //     console.log(findWallets.dataValues);
    // }else{
    //     console.log('데이터 탐색 실패!');
    // }
    const data = findWallets.dataValues;

    console.log('데이터 가져오기 성공. 보상을 지급합니다!');
    //reward type
    // 1 = 로그인 : 1token
    // 2 = 게시물 작성 : 3token
    // 3 = 댓글 작성
    // 서버 계좌에서 transfer 함수 호출로 각 상황에 맞는 보상 토큰 지급 후 response
    // database update

    //로그인
    if (reward_type === "1"){
        const result = await contract.methods.transfer(data.address,1).send({from: varEnv.senderAddress});
        const token_amount = await contract.methods.balanceOf(data.address).call()

        console.log('로그인 보상 지급 완료!');
        console.log(`${data.address}의 현재 토큰 수량 : ${token_amount}`);
    
        const updateWallet = await models.Wallets.update({token_amount: token_amount},{
            where : {
                user_id: user_id
            }
        })
        console.log(updateWallet);
        res.status(200).json({reward_amount: 1});
    }
    //게시물 작성
    if (reward_type === "2"){
        const result = await contract.methods.transfer(data.address,3).send({from: varEnv.senderAddress});
        const token_amount = await contract.methods.balanceOf(data.address).call()

        console.log('게시글 작성 보상 지급 완료!');
        console.log(`${data.address}의 현재 토큰 수량 : ${token_amount}`);
    
        const updateWallet = await models.Wallets.update({token_amount: token_amount},{
            where : {
                user_id: user_id
            }
        })
        console.log(updateWallet);
        res.status(200).json({reward_amount: 3});
    }
}