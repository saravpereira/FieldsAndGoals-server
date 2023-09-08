const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match");

router.post("", matchController.createMatch);
router.get('/getPastResults', matchController.getPastResults);
router.get('/getGamesByDates', matchController.getResultsByDates);

module.exports = router;