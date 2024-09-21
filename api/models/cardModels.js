// models/taskModels.js
const mongoose = require('mongoose');
const { statusEnum } = require("../helper/enumerations");

const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',  // Referensi ke Collection Lists
    required: true  // Setiap Card harus terkait dengan List
  },
  assignedTo: [{
    type: String,
    ref: 'User'  // Array referensi ke Users (bisa lebih dari satu pengguna)
  }],
  status: {
    type: String,
    enum: statusEnum,  
    default: 'to-do'  
  },
  createdAt: {
    type: Date,
    default: Date.now  
  },
  dueDate: {
    type: Date,
    required: false  
  }
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;




