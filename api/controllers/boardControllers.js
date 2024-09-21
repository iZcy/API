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
        res.status(200).json({ data: "Board created" });
    } catch (error) {
        res.status(500).send("Error saving board");
    }
};

module.exports = {
    boardPost,
    boardGet
};
