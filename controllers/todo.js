const Todo = require("../models/todo");

exports.createTodo = (req, res, next) => {
  const matchData = {
    matchDate: req.body.matchDate,
    league: req.body.league,
    homeTeam: req.body.homeTeam,
    awayTeam: req.body.awayTeam,
    homeScore: req.body.homeScore,
    awayScore: req.body.awayScore,
    matchStatus: req.body.matchStatus,
    homeLogo: req.body.homeLogo,
    awayLogo: req.body.awayLogo,
  };

  Todo.findOne({}, (err, todo) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to create match data",
        error: err,
      });
    }

    if (!todo) {
      // If no existing document, create a new one
      const newTodo = new Todo({
        matches: [matchData],
      });

      newTodo.save((err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to create match data",
            error: err,
          });
        }
        res.status(201).json({
          message: "Match data added successfully",
          match: {
            ...result._doc.matches[0], // Assuming you want to return the first match
            id: result._id,
          },
        });
      });
    } else {
      // If an existing document is found, add the new match data to the array
      todo.matches.push(matchData);
      todo.save((err, result) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to add match data",
            error: err,
          });
        }
        res.status(201).json({
          message: "Match data added successfully",
          match: {
            ...matchData, // Return the newly added match data
            id: result._id,
          },
        });
      });
    }
  });
};
