require("dotenv").config();
const varEnv = {
  rpcURL: process.env.RPC_URL,
  contractAddress: process.env.ERC20_CONTRACT_ADDRESS,
  erc721ContractAddress: process.env.ERC721_CONTRACT_ADDRESS,
  faucetSender: process.env.FAUCET_SENDER,
  faucetSenderPrivate: process.env.FAUCET_SENDER_PRIVATE,
  senderAddress: process.env.SENDER,
  senderPrivate: process.env.SENDER_PRIVATE,
  pinataAPI: process.env.PINATA_API,
  pinataSecret: process.env.PINATA_SECRET,
};

console.log(varEnv);
module.exports = varEnv;
