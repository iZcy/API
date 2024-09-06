// models/taskModels.js
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    // enum 'todo', 'doing', 'done'
    type: String,
    required: true,
    enum: ["todo", "doing", "done"]
  }
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
