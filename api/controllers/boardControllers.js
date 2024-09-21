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
        const data = await Board.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send("Error getting boards");
    }
};

const boardPost = async (req, res) => {
    try {
        const { title, userId, description, createdBy, visibility } = req.body

        //check existence of required fields
        if (!title) return res.status(400).json({ message: "Title is required" });
        if (!userId) return res.status(400).json({ message: "User ID is required" });
        if (!createdBy) return res.status(400).json({ message: "CreatedBy is required" });
        
        if (!enums.visibilityEnum.includes(visibility)) return res.status(400).json({ message: "Invalid visibility value." });

        //check data types
        if (typeof title !== "string") return res.status(400).json({ message: "Invalid title: Wrong Type" });
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ message: "Invalid userId: Must be a valid ObjectId" });
        if (typeof createdBy !== "string") return res.status(400).json({ message: "Invalid createdBy: Wrong Type" });

        const userExists = await User.findById(userId);
        if (!userExists) return res.status(400).json({ message: "User ID not found" });

        const newBoard = new Board({
            title,
            userId,
            description,
            createdBy,
            visibility
        });

        await newBoard.save();
        res.status(201).json({ data: "Board created", board: newBoard });
    } catch (error) {
        res.status(500).send("Error saving board");
    }
};

const boardPatch = async (req, res) => {
    try {
        const {id, title, userId, description, createdBy, visibility } = req.body;
        const data = await Board.findById(id);

        //check avaliability
        if (!id) return res.status(400).json({ data: "ID is required" });

        if (!data) {
            return res.status(404).send("Board not found");
        }
        
        if (userId){
            if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ data: "Invalid userId: Must be a valid ObjectId" });
            
            const userExists = await User.findById(userId);
            if (!userExists) return res.status(400).json({ data: "User ID not found" });
        }

        //check data types
        if (title && typeof title !== "string") return res.status(400).json({ data: "Invalid title: Wrong Type" });
        if (description && typeof description !== "string") return res.status(400).json({ data: "Invalid description: Wrong Type" });
        if (createdBy && typeof createdBy !== "string") return res.status(400).json({ data: "Invalid createdBy: Wrong Type" });

        data.title = title;
        data.description = description;
        data.createdBy = createdBy;
        data.visibility = visibility;
        await data.save();

        res.status(200).send(data + " updated");
    } catch (error) {
        res.status(500).send("Error updating board");
    }
};

const boardDelete = [deleteListsMiddleware, async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ data: "ID is required" });

        await Board.findByIdAndDelete(id);
        res.status(200).send("Board deleted");
    } catch (error) {
        res.status(500).send("Error deleting board");
    }
}];

module.exports = {
    boardPost,
    boardGet,
    boardPatch,
    boardDelete
};