const mongoose = require('mongoose');
const Board = require('../models/boardModels');
const Lists = require('../models/listsModels');

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
        const { boardId, title, description, createdBy, visibility } = req.body;

        if (!boardId || !title || !createdBy || !visibility) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const newBoard = new Board({
            boardId,
            title,
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
        const { id, title, description, createdBy, visibility } = req.body;
        const data = await Board.findById(id);

        if (!data) {
            return res.status(404).send("Board not found");
        }

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