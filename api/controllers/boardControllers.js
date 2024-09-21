const mongoose = require('mongoose');
const Board = require('../models/boardModels');
const Lists = require('../models/listsModels');
const Cards = require('../models/cardModels');
const Comment = require('../models/commentsModels'); // Import model Comment

const boardDelete = async (req, res) => {
    try {
        const { id } = req.body;

        // Check if the board exists
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        // Find all lists related to the board
        const lists = await Lists.find({ boardId: id });

        // Delete all related cards for those lists
        await Cards.deleteMany({ listId: { $in: lists.map(list => list._id) } });

        // Delete all related comments for those cards
        await Comment.deleteMany({ cardId: { $in: lists.flatMap(list => list.cards) } }); // Assuming lists have a cards field

        // Delete all related lists
        await Lists.deleteMany({ boardId: id });

        // Finally, delete the board
        await Board.findByIdAndDelete(id);
        res.status(200).send("Board and related lists, cards, and comments deleted");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting board and related data");
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
        const { title, description, createdBy, visibility } = req.body;

        if (!title || !createdBy || !visibility) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const newBoard = new Board({
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

        data.title = title || data.title;
        data.description = description || data.description;
        data.createdBy = createdBy || data.createdBy;
        data.visibility = visibility || data.visibility;
        await data.save();

        res.status(200).send("Board updated");
    } catch (error) {
        res.status(500).send("Error updating board");
    }
};

module.exports = {
    boardPost,
    boardGet,
    boardPatch,
    boardDelete
};
