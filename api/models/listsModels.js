const mongoose = require("mongoose");

const listsSchema = new mongoose.Schema({
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

const Lists = mongoose.model("Lists", listsSchema);

module.exports = Lists;