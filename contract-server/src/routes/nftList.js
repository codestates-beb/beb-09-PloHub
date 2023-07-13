const router = require("express").Router();
const nftListController = require("../controllers/nftList");

router.get("/nftList", nftListController.nftList);

module.exports = router;