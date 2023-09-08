const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match");

router.post("", matchController.createMatch);
router.get('/espn/getPastResults', matchController.getPastResults);

module.exports = router;