const Web3 = require('web3');
const abiSource = require('../abi/NFTLootBox.json');
const abiSourceERC20 = require('../abi/ICToken.json');
const models = require('../models');
const varEnv = require('../config/var');


//get userNFT
exports.userNFT = async(req,res) => {
    try{
        const {user_id} = req.body;

        if (!user_id) return res.status(400).json({message: 'UserID is required'});

        const userNFTs = await models.nfts.findAll({
            where:{
                user_id: user_id
            }
         })
        const dataValuesArray = userNFTs.map(item => item.dataValues);
        console.log(dataValuesArray);   
        
        res.status(200).json({message: 'OK', data: dataValuesArray});


    }catch(error){
        console.log(error);
        res.status(500).json({ error : error});
    }
}