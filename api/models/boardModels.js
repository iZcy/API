const mongoose = require("mongoose");
const { Schema } = mongoose;
const enums = require("../helper/enumerations");

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
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
        enum: enums.visibilityEnum
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;