const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  listId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  boardId: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;