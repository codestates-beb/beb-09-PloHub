const router = require("express").Router();
const transferTokenController = require("../controllers/transferToken");

router.post("/transferToken", transferTokenController.transferToken);

module.exports = router;