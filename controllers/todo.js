const Todo = require("../models/todo");

//sample for testing
exports.createTodo = (req, res, next) => {
  const todo = new Todo({
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
  });

  todo
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Todo added successfully",
        post: {
          ...result,
          id: result._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fail to create todo!",
      });
    });
};
