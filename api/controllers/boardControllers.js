const mongoose = require("mongoose");
const User = require("../models/userModels");
const Board = require("../models/boardModels");
const Lists = require("../models/listsModels");
const enums = require("../helper/enumerations");

const deleteListsMiddleware = async (req, res, next) => {
  try {
    const { id } = req.body;

    const board = await Board.findById(id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    await Lists.deleteMany({ boardId: id });

        next();
    } catch (error) {
        console.error("Error deleting lists related to the board:", error);
        res.status(500).json({ message: "Error deleting lists related to the board" });
    }
};

const boardGet = async (req, res) => {
    try {
        const data = await Board.find().populate('userId', 'username');
        res.status(200).send(data);
    } catch (error) {
        console.error("Error retrieving boards:", error);
        res.status(500).send("Error retrieving boards");
    }
};

const boardPost = async (req, res) => {
  try {
    const { title, userId, description, visibility } = req.body;

        if (!title) return res.status(400).json({ message: "Title is required" });
        if (!userId) return res.status(400).json({ message: "User ID is required" });
        if (!visibility) return res.status(400).json({ message: "Visibility is required" });
        if (!enums.visibilityEnum.includes(visibility)) return res.status(400).json({ message: "Invalid visibility value" });

        if (typeof title !== "string") return res.status(400).json({ message: "Invalid title: Wrong Type" });
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId: Must be a valid ObjectId" });
        if (description && typeof description !== "string") return res.status(400).json({ message: "Invalid description: Wrong Type" });

        const userExists = await User.findById(userId);
        if (!userExists) return res.status(404).json({ message: "User ID not found" });

        const newBoard = new Board({
            title,
            userId,
            description,
            createdBy: userExists.username, 
            visibility
        });

        await newBoard.save();
        res.status(201).json({ message: "Board created", data: newBoard });
    } catch (error) {
        console.error("Error saving board:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation Error: ${error.message}` });
        }
        res.status(500).send("Error saving board");
    }
};

const boardPatch = async (req, res) => {
    try {
        const { title, description, visibility } = req.body;
        const { id } = req.params; 

        // Validation checks
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid boardId: Must be a valid ObjectId" });

        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).send("Board not found");
        }

        // Check data types
        if (title && typeof title !== "string") return res.status(400).json({ message: "Invalid title: Wrong Type" });
        if (description && typeof description !== "string") return res.status(400).json({ message: "Invalid description: Wrong Type" });
        if (visibility && !enums.visibilityEnum.includes(visibility)) return res.status(400).json({ message: "Invalid visibility value" });

        // Update board fields
        board.title = title || board.title;
        board.description = description || board.description;
        board.visibility = visibility || board.visibility;

        await board.save();

        res.status(200).json({ message: "Board updated", board });
    } catch (error) {
        console.error("Error updating board:", error);
        res.status(500).send("Error updating board");
    }
};

const boardDelete = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate Board ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid Board ID" });
        }

        const board = await Board.findByIdAndDelete(id);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        res.status(200).json({ message: "Board deleted", board });
    } catch (error) {
        console.error("Error deleting board:", error);
        res.status(500).send("Error deleting board");
    }
};

module.exports = {
    boardPost,
    boardGet,
    boardPatch,
    boardDelete,
    deleteListsMiddleware
};