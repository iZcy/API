const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    boardId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        required: true,
        enum: ["public", "private"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;