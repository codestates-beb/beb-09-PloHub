const router = require("express").Router();
const nftDetailController = require("../controllers/nftDetail");

router.get("/nftDetail", nftDetailController.nftDetail);

module.exports = router;