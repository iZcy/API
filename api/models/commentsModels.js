// models/commentsModels.js
const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  "cardId": {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cards", // Reference to Cards collection
    required: true
  },
  "userId": {
    type: mongoose.Schema.Types.ObjectId,
    // ref: "Users", // Reference to Users collection
    required: true
  },
  "content": {
    type: String,
    required: true
  },
  // "createdAt": {
  //   type: Date,
  //   required: true
  // },
  "isEdited": {
    type: Boolean,
    default: false // Defaults to false wince new comments haven't been edited yet
  }
}, { timestamps: true});

const Comments = mongoose.model("Comments", commentsSchema);

module.exports = Comments;