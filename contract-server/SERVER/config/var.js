require('dotenv').config();
const varEnv = {
    contractAddress: process.env.ERC20_CONTRACT_ADDRESS,
    faucetSender: process.env.FAUCET_SENDER,
    faucetSenderPrivate: process.env.FAUCET_SENDER_PRIVATE,
    senderAddress: process.env.SENDER,
    senderPrivate: process.env.SENDER_PRIVATE,
}
module.exports = varEnv;