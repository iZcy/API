const Board = require('../models/boardModels');

const boardGet = async (req, res) => {
    try {
        const data = await Board.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send("Error getting tasks");
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
        res.status(201).json({ data: "Board created", board: newBoard});
    } catch (error) {
        res.status(500).send("Error saving board");
    }
};

const boardPatch = async (req, res) => {
    try {
        const {id, boardId, title, description, createdBy, visibility } = req.body;
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
