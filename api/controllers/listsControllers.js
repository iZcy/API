const mongoose = require("mongoose");
const Lists = require("../models/listsModels");
const Cards = require("../models/cardModels");
const Boards = require("../models/boardModels");

// GET all lists
const listsGet = async (req, res) => {
  try {
    const data = await Lists.find().populate("boardId");
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting Lists");
  }
};

// POST a new list
const listsPost = async (req, res) => {
  try {
    const { title, boardId, position, createdBy } = req.body;

    if (!title) return res.status(400).json({ data: "Title is required" });
    if (!boardId) return res.status(400).json({ data: "Board ID is required" });
    if (!position) return res.status(400).json({ data: "Position is required" });
    if (!createdBy) return res.status(400).json({ data: "CreatedBy is required" });

    if (typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });

    if (!mongoose.Types.ObjectId.isValid(boardId))
      return res.status(400).json({ data: "Invalid boardId: Must be a valid ObjectId" });

    if (typeof position !== "number")
      return res.status(400).json({ data: "Invalid position: Wrong Type" });
    if (typeof createdBy !== "string")
      return res.status(400).json({ data: "Invalid createdBy: Wrong Type" });

    const boardExists = await Boards.findById(boardId);
    if (!boardExists) {
      return res.status(400).json({ data: "Board ID not found" });
    }

    const newList = new Lists({
      title,
      boardId,
      position,
      createdBy
    });

    await newList.save();
    res.status(201).json({ data: "List created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error saving List" });
  }
};

// PATCH an existing list
const listsPatch = async (req, res) => {
  try {
    const { id, title, boardId, position, createdBy } = req.body;

    if (!id) return res.status(400).json({ data: "ID is required" });

    const data = await Lists.findById(id);
    if (!data) {
      return res.status(404).json({ data: "List not found" });
    }

    if (title && typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });

    if (boardId) {
      if (!mongoose.Types.ObjectId.isValid(boardId))
        return res.status(400).json({ data: "Invalid boardId: Must be a valid ObjectId" });

      const boardExists = await Boards.findById(boardId);
      if (!boardExists) {
        return res.status(400).json({ data: "Board ID not found" });
      }
    }

    if (position && typeof position !== "number")
      return res.status(400).json({ data: "Invalid position: Wrong Type" });
    if (createdBy && typeof createdBy !== "string")
      return res.status(400).json({ data: "Invalid createdBy: Wrong Type" });

    data.title = title || data.title;
    data.boardId = boardId || data.boardId;
    data.position = position || data.position;
    data.createdBy = createdBy || data.createdBy;

    await data.save();
    res.status(200).json({ data: "List updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error updating List" });
  }
};

// DELETE a list and related cards
const listsDelete = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.status(400).json({ data: "ID is required" });

    // Check if the list exists
    const list = await Lists.findById(id);
    if (!list) {
      return res.status(404).json({ data: "List not found" });
    }

    // Delete all related cards
    await Cards.deleteMany({ listID: id }); // Ensure Cards model has a field listID

    // Now delete the list
    await Lists.findByIdAndDelete(id);

    res.status(200).json({ data: "List and related cards deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error deleting List" });
  }
};

module.exports = {
  listsGet,
  listsPost,
  listsPatch,
  listsDelete,
};