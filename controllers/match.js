const MatchData = require("../models/match");

exports.createMatchData = (req, res) => {
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