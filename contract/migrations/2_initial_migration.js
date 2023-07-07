const ERC721 = artifacts.require("NFTLootBox");

module.exports = function(deployer){
    deployer.deploy(ERC721);
}