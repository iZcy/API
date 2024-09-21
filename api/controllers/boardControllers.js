const mongoose = require('mongoose');
const Board = require("../models/boardModels");
const User = require("../models/userModels");
const Lists = require('../models/listsModels');
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
        console.error(error);
        res.status(500).json({ message: "Error deleting lists related to the board" });
    }
};

const boardGet = async (req, res) => {
    try {
        const data = await Board.find().populate('createdBy', 'username'); // Populate the username field from User
        res.status(200).send(data);
    } catch (error) {
        es.status(500).send("Error getting boards");
    }
};

const boardPost = async (req, res) => {
    try {
        const { title, userId, description, visibility } = req.body;

        // Check existence of required fields
        if (!title) return res.status(400).json({ message: "Title is required" });
        if (!userId) return res.status(400).json({ message: "User ID is required" });

        if (!enums.visibilityEnum.includes(visibility)) return res.status(400).json({ message: "Invalid visibility value." });

        // Check data types
        if (typeof title !== "string") return res.status(400).json({ message: "Invalid title: Wrong Type" });
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId: Must be a valid ObjectId" });

        // Check if user exists and fetch username
        const userExists = await User.findById(userId);
        if (!userExists) return res.status(400).json({ message: "User ID not found" });

        // Log the username to verify if it's being retrieved correctly
        console.log(`Creating board with username: ${userExists.username}`);

        const newBoard = new Board({
            title,
            userId,
            description,
            createdBy: userExists.username,
            visibility
        });

        await newBoard.save();
        res.status(201).json({ data: "Board created", board: newBoard});
    } catch (error) {
        console.error("Error saving board:", error.message);
        
        // Capture and return the specific error
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Validation Error: ${error.message}` });
        }

        res.status(500).send("Error saving board");
    }
};

const boardPatch = async (req, res) => {
    try {
        const {id, title, description, visibility } = req.body;
        const data = await Board.findById(id);

        if (!data) {
        return res.status(404).send("Board not found");
        }

        //check data types
        if (title && typeof title !== "string") return res.status(400).json({ data: "Invalid title: Wrong Type" });
        if (description && typeof description !== "string") return res.status(400).json({ data: "Invalid description: Wrong Type" });

        data.title = title;
        data.userId = data.userId;
        data.description = description;
        data.createdBy = data.createdBy;
        data.visibility = visibility;
        await data.save();

        res.status(200).send(data + " updated");
    } catch (error) {
        res.status(500).send("Error updating board");
    }
};

const boardDelete = async (req, res) => {
    try {
        const { id } = req.body;
        await Board.findByIdAndDelete(id);

        res.status(200).send("Board deleted");
    } catch (error) {
        res.status(500).send("Error deleting board");
    }
};

module.exports = {
    boardPost,
    boardGet,
    boardPatch,
    boardDelete
};
