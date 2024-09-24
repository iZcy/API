const mongoose = require("mongoose");
const Lists = require("../models/listsModels");
const Cards = require("../models/cardModels");
const Comment = require("../models/commentsModels");
const Boards = require("../models/boardModels");

const listsGet = async (req, res) => {
  try {
    const { boardId } = req.params;
    // check boardId is valid
    const boardExists = await Boards.findById(boardId);
    if (!boardExists) {
      return res.status(400).json({ data: "Board ID not found" });
    }

    let data = await Lists.find().populate("boardId");

    data = data.filter((list) => list.boardId._id.toString() === boardId);
    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error getting Lists" });
  }
};

const listsPost = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, position } = req.body;

    if (!title) return res.status(400).json({ data: "Title is required" });
    if (!boardId) return res.status(400).json({ data: "Board ID is required" });
    if (!position && position !== 0)
      return res.status(400).json({ data: "Position is required" });

    if (typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });

    if (!mongoose.Types.ObjectId.isValid(boardId))
      return res
        .status(400)
        .json({ data: "Invalid boardId: Must be a valid ObjectId" });

    if (typeof position !== "number")
      return res.status(400).json({ data: "Invalid position: Wrong Type" });

    const boardExists = await Boards.findById(boardId);
    if (!boardExists) {
      return res.status(400).json({ data: "Board ID not found" });
    }

    const newList = new Lists({
      title,
      boardId,
      position
    });

    await newList.save();
    res.status(201).json({ data: "List created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error saving List" });
  }
};

const listsPatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, boardId, position } = req.body;

    if (!id) return res.status(400).json({ data: "ID is required" });

    const data = await Lists.findById(id);
    if (!data) {
      return res.status(404).json({ data: "List not found" });
    }

    if (title && typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });

    if (boardId) {
      if (!mongoose.Types.ObjectId.isValid(boardId))
        return res
          .status(400)
          .json({ data: "Invalid boardId: Must be a valid ObjectId" });

      const boardExists = await Boards.findById(boardId);
      if (!boardExists) {
        return res.status(400).json({ data: "Board ID not found" });
      }
    }

    if (position && typeof position !== "number")
      return res.status(400).json({ data: "Invalid position: Wrong Type" });

    data.title = title || data.title;
    data.boardId = boardId || data.boardId;
    data.position = position || data.position;

    await data.save();
    res.status(200).json({ data: "List updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error updating List" });
  }
};

const listsDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ data: "ID is required" });

    const list = await Lists.findById(id);
    if (!list) {
      return res.status(404).json({ data: "List not found" });
    }

    const relatedCards = await Cards.find({ listId: id });
    await Cards.deleteMany({ listId: id });

    await Comment.deleteMany({
      cardId: { $in: relatedCards.map((card) => card._id) }
    });

    await Lists.findByIdAndDelete(id);

    res.status(200).json({ data: "List, related cards, and comments deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error deleting List" });
  }
};

module.exports = {
  listsGet,
  listsPost,
  listsPatch,
  listsDelete
};
