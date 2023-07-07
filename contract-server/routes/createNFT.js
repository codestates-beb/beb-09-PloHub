const router = require("express").Router();
const createNFTController = require("../controllers/createNFT");

router.post("/mint", createNFTController.createNFT);

module.exports = router;