const mongoose = require("mongoose");
const { Schema } = mongoose;

const listsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  boardId: {
    type: Schema.Types.ObjectId,
    ref: "Board",
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Lists = mongoose.model("List", listsSchema);

module.exports = Lists;
