const Web3 = require('web3');
const abiSource = require('../../contract/build/contracts/ICToken.json');
const models = require('../models');
const sequelize = require('sequelize');
const varEnv = require('../config/var');

exports.reward = async (req, res) => {
    const abi = abiSource.abi;

    const {user_id, email, reward_type} = req.body;
    const web3 = new Web3('http://127.0.0.1:7545');
    const contract = new web3.eth.Contract(abi, varEnv.contractAddress);
    //reward type
    // 0 = 회원가입
    // 1 = 로그인
    // 2 = 게시물 작성
    // 3 = 댓글 작성
    // 서버 계좌에서 transfer 함수 호출로 각 상황에 맞는 보상 토큰 지급 후 response
    // database update

    //회원가입 
    if (reward_type === 0){
        
    }
    //로그인
    if (reward_type === 1){

    }
    //게시물 작성
    if (reward_type === 2){

    }
}