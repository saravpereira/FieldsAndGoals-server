const Todo = require("../models/todo");

exports.createTodo = (req, res, next) => {
  const todo = new Todo({
    matchDate: req.body.matchDate,
    league: req.body.league,
    homeTeam: req.body.homeTeam,
    awayTeam: req.body.awayTeam,
    homeScore: req.body.homeScore,
    awayScore: req.body.awayScore,
    matchStatus: req.body.matchStatus,
    homeLogo: req.body.homeLogo,
    awayLogo: req.body.awayLogo,
  });

  todo
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Match data added successfully",
        match: {
          ...result._doc,
          id: result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Failed to add match data",
        error: err,
      });
    });
};
