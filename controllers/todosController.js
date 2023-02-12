const Todo = require("../models/Todo");
const asyncHandler = require("express-async-handler");

const getAllTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find().lean();

  if (!todos?.length) {
    return res.status(400).json({ message: "No todos found" });
  }

  res.json(todos);
});

const createNewTodo = asyncHandler(async (req, res) => {
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await Todo.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate todo title" });
  }

  const todo = await Todo.create({ title, completed });

  if (todo) {
    return res.status(201).json({ message: "New todo created" });
  } else {
    return res.status(400).json({ message: "Invalid todo data received" });
  }
});

const updateTodo = asyncHandler(async (req, res) => {
  const { id, completed } = req.body;

  if (!id || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields are required" });
  }

  const todo = await Todo.findById(id).exec();

  if (!todo) {
    return res.status(400).json({ message: "Todo not found" });
  }

  const duplicate = await Todo.findOne({ id }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate todo title" });
  }

  todo.completed = completed;

  const updatedTodo = await todo.save();

  res.json(`'${updatedTodo.id}' updated`);
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Todo ID required" });
  }

  const todo = await Todo.findById(id).exec();

  if (!todo) {
    return res.status(400).json({ message: "Todo not found" });
  }

  const result = await todo.deleteOne();

  const reply = `Todo '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllTodos,
  createNewTodo,
  updateTodo,
  deleteTodo,
};
