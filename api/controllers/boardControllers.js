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
