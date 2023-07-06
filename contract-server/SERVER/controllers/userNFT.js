const Web3 = require('web3');
const abiSource = require('../../contract/build/contracts/NFTLootBox.json');
const abiSourceERC20 = require('../../contract/build/contracts/ICToken.json');
const models = require('../models');
const varEnv = require('../config/var');


//get userNFT
exports.createNFT = async(req,res) => {
    try{

    }catch(error){
        console.log(error);
        res.status(500).json({ error : 'NFT 정보를 가져오지 못했습니다.'});
    }
}