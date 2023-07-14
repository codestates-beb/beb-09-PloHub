const router = require("express").Router();
const createController = require("../controllers/create");

router.post("/create", createController.createWallet);

module.exports = router;