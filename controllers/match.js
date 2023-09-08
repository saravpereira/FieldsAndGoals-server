const MatchData = require("../models/match");
const { getYesterdayDate } = require("../utils/dateUtils");
const { postData } = require('./postData');
const scrapeController = require("./webscrapeController");

const yesterdayDate = getYesterdayDate();

exports.createMatch = (req, res) => {
  const matchesData = req.body.matches;

  const matchData = new MatchData({
    matches: matchesData.map((match) => ({
      matchDate: match.matchDate,
      league: match.league,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      matchStatus: match.matchStatus,
      homeLogo: match.homeLogo,
      awayLogo: match.awayLogo,
    })),
  });

  matchData
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Match data added successfully",
        matches: result.matches,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to add match data",
        error: err,
      });
    });
};

exports.getPastResults = async (_, res) => {
  try {
    const allMatchData = await scrapeController.scrapeEspn(yesterdayDate, yesterdayDate);
    const postSuccess = await postData(allMatchData);
    if (postSuccess) {
      const successMessage = 'Successfully posted data';
      console.log(successMessage);
      res.status(200).json({ message: successMessage });
    } else {
      res.status(500).json({ error: 'Failed to post data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
