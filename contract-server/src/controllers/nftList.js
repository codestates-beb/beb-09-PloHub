const models = require('../models');

exports.nftList = async (req,res) => {
    try{
    const nftListData = await models.nfts.findAll()

    const nftList = nftListData.map(item => item.dataValues);

        if (!nftList){
            return res.status(400).json({message: 'NFT data does not exist'})
        }
        res.status(200).json({message: 'OK', data: nftList});
    }catch(error){
        res.status(500).json({error: error});
    }
}