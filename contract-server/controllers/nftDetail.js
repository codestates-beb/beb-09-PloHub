const Web3 = require('web3');
const abiSource = require('../abi/NFTLootBox.json');
const abiSourceERC20 = require('../abi/ICToken.json');
const models = require('../models');
const varEnv = require('../config/var');


exports.nftDetail = async (req,res) => {
    try{
    const {token_id} = req.body;

    const nftInfo = await models.nfts.findOne({
        where: {
            token_id: token_id
        }
    })

    const nftData = nftInfo.dataValues;
    console.log(nftData);

    res.status(200).json({message: 'OK', owner_address: nftData.owner_address, price: nftData.price, name:nftData.name, description: nftData.description, image: nftData.image});
    //  

    }catch(error){
        console.log(error);
        res.status(500).json({error: error});
    }
}