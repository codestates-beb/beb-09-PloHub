const Wallet = require('../models/Wallets');

module.exports = {
  wallets: {
    post: async (user_id, address, encrypted_private_key, eth_amount, token_amount, callback) => {
      try {
        const wallet = await Wallet.create({
          user_id: user_id,
          address: address,
          encrypted_private_key: encrypted_private_key,
          eth_amount: eth_amount,
          token_amount: token_amount,
        });

        console.log(wallet.toJSON());
        callback(null, wallet.toJSON());
      } catch (err) {
        console.error(err);
        callback(err, null);
      }
    },
  },
};