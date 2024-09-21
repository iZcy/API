const Lists = require("../models/listsModels");

// GET all lists
const listsGet = async (req, res) => {
  try {
    const data = await Lists.find();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting Lists");
  }
};

// POST a new list
const listsPost = async (req, res) => {
  try {
    const { listId, title, boardId, position, createdBy } = req.body;

    // Check Body Existence
    if (!listId) return res.status(400).json({ data: "listId is required" });
    if (!title) return res.status(400).json({ data: "Title is required" });
    if (!boardId) return res.status(400).json({ data: "Board ID is required" });
    if (!position) return res.status(400).json({ data: "Position is required" });
    if (!createdBy) return res.status(400).json({ data: "CreatedBy is required" });

    // Check Body Validity
    if (typeof listId !== "string")
      return res.status(400).json({ data: "Invalid listId: Wrong Type" });
    if (typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });
    if (typeof boardId !== "string")
      return res.status(400).json({ data: "Invalid boardId: Wrong Type" });
    if (typeof position !== "number")
      return res.status(400).json({ data: "Invalid position: Wrong Type" });
    if (typeof createdBy !== "string")
      return res.status(400).json({ data: "Invalid createdBy: Wrong Type" });

    // Check if the list already exists
    const existingList = await Lists.findOne({ listId });
    if (existingList) {
      return res.status(400).json({ data: "List with this ID already exists" });
    }

    const newLists = new Lists({
      listId,
      title,
      boardId,
      position,
      createdBy
    });

    await newLists.save();
    res.status(201).json({ data: "List created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error saving List" });
  }
};

// PATCH an existing list
const listsPatch = async (req, res) => {
  try {
    const { id, listId, title, boardId, position, createdBy } = req.body;

    // Check Body Existence
    if (!id) return res.status(400).json({ data: "ID is required" });

    // Find existing list by ID
    const data = await Lists.findById(id);
    if (!data) {
      return res.status(404).json({ data: "List not found" });
    }

    // Validate fields and check for listId uniqueness
    if (listId && listId !== data.listId) {
      const existingList = await Lists.findOne({ listId });
      if (existingList) {
        return res.status(400).json({ data: "List with this ID already exists" });
      }
      if (typeof listId !== "string")
        return res.status(400).json({ data: "Invalid listId: Wrong Type" });
    }

    if (title && typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });
    if (boardId && typeof boardId !== "string")
      return res.status(400).json({ data: "Invalid boardId: Wrong Type" });
    if (position && typeof position !== "number")
      return res.status(400).json({ data: "Invalid position: Wrong Type" });
    if (createdBy && typeof createdBy !== "string")
      return res.status(400).json({ data: "Invalid createdBy: Wrong Type" });

    // Update the list with valid fields
    data.listId = listId || data.listId;
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
