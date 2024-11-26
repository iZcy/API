const mongoose = require("mongoose");
const Lists = require("../models/listsModels");
const Boards = require("../models/boardModels");
const { deleteAllByListId } = require("./cardControllers");

// Delete all lists by Board ID
const deleteAllByBoardId = async (boardId) => {
  try {
    // Find all lists with the boardId
    const data = await Lists.find({ boardId });
    // Delete all associated cards for each list
    data.map((list) => deleteAllByListId(list._id));
    // Delete all lists
    await Lists.deleteMany({ boardId });

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Get all lists for a board (include collaborator filtering)
const listsGet = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.query; // Query parameter for collaborator filtering

    // Check if boardId is valid
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ data: "Invalid boardId: Must be a valid ObjectId" });
    }

    // Check if board exists
    const boardExists = await Boards.findById(boardId);
    if (!boardExists) {
      return res.status(400).json({ data: "Board ID not found" });
    }

    // Fetch lists for the board
    let listsQuery = { boardId };

    // If userId is provided, filter lists where user is a collaborator
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ data: "Invalid userId: Must be a valid ObjectId" });
      }
      listsQuery = {
        boardId,
        $or: [
          { assignedTo: userId }, // User is a collaborator
          { createdBy: userId }  // User is the creator
        ]
      };
    }

    // Find the lists with the query
    const lists = await Lists.find(listsQuery)
      .populate("assignedTo", "username name email") // Populate collaborator details
      .populate("createdBy", "username name email"); // Populate creator details

    res.status(200).json({ data: lists });
  } catch (error) {
    console.error("Error getting Lists: ", error);
    res.status(500).json({ data: `Error getting Lists: ${error.message}` });
  }
};

// Create a new list
const listsPost = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, position, assignedTo, createdBy } = req.body;

    // Validate input
    if (!title) return res.status(400).json({ data: "Title is required" });
    if (!boardId) return res.status(400).json({ data: "Board ID is required" });
    if (!position && position !== 0)
      return res.status(400).json({ data: "Position is required" });
    if (!createdBy) return res.status(400).json({ data: "CreatedBy is required" });

    if (!mongoose.Types.ObjectId.isValid(boardId))
      return res.status(400).json({ data: "Invalid boardId: Must be a valid ObjectId" });

    // Check if board exists
    const boardExists = await Boards.findById(boardId);
    if (!boardExists) {
      return res.status(400).json({ data: "Board ID not found" });
    }

    // Create the new list
    const newList = new Lists({
      title,
      boardId,
      position,
      assignedTo: assignedTo || [], // Assigned collaborators (optional)
      createdBy
    });

    await newList.save();
    res.status(201).json({ data: "List created successfully" });
  } catch (error) {
    console.error("Error saving List: ", error);
    res.status(500).json({ data: "Error saving List" });
  }
};

const listsPatch = async (req, res) => {
  try {
    console.log("PATCH request received:", req.body); // Log request body
    const { id } = req.params;
    const { title, boardId, position, assignedTo } = req.body;

    if (!id) return res.status(400).json({ data: "ID is required" });

    const list = await Lists.findById(id);
    if (!list) {
      return res.status(404).json({ data: "List not found" });
    }

    if (title && typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });

    // Update logic
    list.title = title || list.title;
    list.boardId = boardId || list.boardId;
    list.position = position || list.position;

    if (assignedTo && Array.isArray(assignedTo)) {
      list.assignedTo = assignedTo;
    }

    await list.save();
    console.log("List updated successfully:", list); // Log updated list
    res.status(200).json({ data: "List updated" });
  } catch (error) {
    console.error("Error updating list:", error.message); // Log error backend
    res.status(500).json({ data: "Error updating List" });
  }
};

const listsDelete = async (req, res) => {
  try {
    const listId = req.params.id;

    // Check if the list ID is provided
    if (!listId) return res.status(400).json({ error: "list ID is required." });

    // Check if the list ID is valid
    const list = await Lists.findById(listId);
    if (!list)
      return res.status(400).json({ data: "ID is not a valid List ID." });

    const deletedList = await Lists.findByIdAndDelete(req.params.id);
    if (!deletedList)
      return res.status(404).json({ message: "List not found" });
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Failed to delete list" });
  }
};

module.exports = {
  listsGet,
  listsPost,
  listsPatch,
  listsDelete,
  deleteAllByBoardId
};
