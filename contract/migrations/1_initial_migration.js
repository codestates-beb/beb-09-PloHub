const ERC20 = artifacts.require("ICToken");

module.exports = function(deployer){
    const name = "MyToken";
    const symbol = "MTK";
    deployer.deploy(ERC20,name,symbol);
}