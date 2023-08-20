const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todo");

router.post("", todoController.createTodo);

module.exports = router;
