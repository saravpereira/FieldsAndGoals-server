const Todo = require("../models/todo");

exports.createTodo = (req, res, next) => {
  const matchesData = req.body.matches; // Assuming req.body.matches is an array of match objects

  const todo = new Todo({
    matches: matchesData.map((matchData) => ({
      matchDate: matchData.matchDate,
      league: matchData.league,
      homeTeam: matchData.homeTeam,
      awayTeam: matchData.awayTeam,
      homeScore: matchData.homeScore,
      awayScore: matchData.awayScore,
      matchStatus: matchData.matchStatus,
      homeLogo: matchData.homeLogo,
      awayLogo: matchData.awayLogo,
    })),
  });

  todo
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
