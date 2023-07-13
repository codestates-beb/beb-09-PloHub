const router = require("express").Router();
const tokenSwapController = require("../controllers/tokenSwap");

router.post("/tokenSwap", tokenSwapController.tokenSwap);

module.exports = router;