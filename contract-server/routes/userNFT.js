const router = require("express").Router();
const userNFTController = require("../controllers/userNFT");

router.get("/userNFT", userNFTController.userNFT);

module.exports = router;