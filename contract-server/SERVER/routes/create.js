const router = require("express").Router();
const createController = require("../controllers/create");

router.post("/wallets/create", createController.createWallet);

module.exports = router;