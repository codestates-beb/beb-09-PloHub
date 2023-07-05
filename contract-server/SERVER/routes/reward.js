const router = require("express").Router();
const rewardController = require("../controllers/reward");

router.post("/reward", rewardController.reward);

module.exports = router;