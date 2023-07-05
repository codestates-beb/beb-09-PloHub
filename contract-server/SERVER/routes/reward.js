const router = require("express").Router();
const rewardController = require("../controllers/reward");

router.post("/wallets/reward", rewardController.reward);

module.exports = router;