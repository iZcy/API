const mongoose = require("mongoose");
const Lists = require("../models/listsModels");
const Boards = require("../models/boardModels");  // Pastikan untuk mengimpor model Board

// GET all lists
const listsGet = async (req, res) => {
  try {
    // Menggunakan populate untuk mengambil data Board yang berhubungan dengan boardId
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

    // Check Body Existence
    if (!title) return res.status(400).json({ data: "Title is required" });
    if (!boardId) return res.status(400).json({ data: "Board ID is required" });
    if (!position) return res.status(400).json({ data: "Position is required" });
    if (!createdBy) return res.status(400).json({ data: "CreatedBy is required" });

    // Check Body Validity
    if (typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });

    // Validate if boardId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(boardId))
      return res.status(400).json({ data: "Invalid boardId: Must be a valid ObjectId" });

    if (typeof position !== "number")
      return res.status(400).json({ data: "Invalid position: Wrong Type" });
    if (typeof createdBy !== "string")
      return res.status(400).json({ data: "Invalid createdBy: Wrong Type" });

    // Check if the boardId exists in the Boards collection
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

    // Check Body Existence
    if (!id) return res.status(400).json({ data: "ID is required" });

    // Find existing list by ID
    const data = await Lists.findById(id);
    if (!data) {
      return res.status(404).json({ data: "List not found" });
    }

    // Validate fields
    if (title && typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });

    // Validate boardId if provided and check its existence in the Boards collection
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

    // Update the list with valid fields
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

// DELETE a list
const listsDelete = async (req, res) => {
  try {
    const { id } = req.body;

    // Check Body Existence
    if (!id) return res.status(400).json({ data: "ID is required" });

    // Find and delete the list
    const data = await Lists.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ data: "List not found" });
    }

    res.status(200).json({ data: "List deleted" });
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