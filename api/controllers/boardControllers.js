const mongoose = require("mongoose");
const User = require("../models/userModels");
const Board = require("../models/boardModels");
const Lists = require("../models/listsModels");
const enums = require("../helper/enumerations");
const listController = require("../controllers/listsControllers");

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
    console.error("Error deleting lists related to the board:", error);
    res
      .status(500)
      .json({ message: "Error deleting lists related to the board" });
  }
};


// const boardGet = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const boards = await Board.find({ userId }).populate("userId", "username");

//     const data = boards.map((board) => ({
//       _id: board._id,
//       title: board.title,
//       createdBy: board.userId.username,
//       description: board.description,
//       visibility: board.visibility,
//     }));

//     res.status(200).json({ message: "Boards retrieved", data });
//   } catch (error) {
//     console.error("Error retrieving boards:", error);
//     res.status(500).json({ message: "Error retrieving boards" });
//   }
// };

const boardGet = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role; // Assuming role is stored in req.user

    let boards;

    if (userRole === "admin") {
      boards = await Board.find().populate("userId", "username");
    } else if (userRole === "guest") {
      boards = await Board.find({ visibility: "public" }).populate("userId", "username");
    } else if (userRole === "member") {
      const memberCards = await Card.find({ assignedTo: userId });
      const memberListIds = memberCards.map(card => card.listId);
      const memberLists = await Lists.find({ _id: { $in: memberListIds } });
      const memberBoardIds = memberLists.map(list => list.boardId);
      boards = await Board.find({ 
        $or: [
          { _id: { $in: memberBoardIds } },
          { visibility: "public" }
        ]
      }).populate("userId", "username");
    }

    const data = boards.map((board) => ({
      _id: board._id,
      title: board.title,
      createdBy: board.userId.username,
      description: board.description,
      visibility: board.visibility,
    }));

    res.status(200).json({ message: "Boards retrieved", data });
  } catch (error) {
    console.error("Error retrieving boards:", error);
    res.status(500).json({ message: "Error retrieving boards" });
  }
};

const boardPost = async (req, res) => {
  try {
    const { title, description, visibility } = req.body;

    const userId = req.user._id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Validation checks
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!visibility)
      return res.status(400).json({ message: "Visibility is required" });
    if (!enums.visibilityEnum.includes(visibility))
      return res.status(400).json({ message: "Invalid visibility value" });

    if (typeof title !== "string")
      return res.status(400).json({ message: "Invalid title: Wrong Type" });
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(400)
        .json({ message: "Invalid userId: Must be a valid ObjectId" });
    if (description && typeof description !== "string")
      return res
        .status(400)
        .json({ message: "Invalid description: Wrong Type" });

    const userExists = await User.findById(userId);
    if (!userExists)
      return res.status(404).json({ message: "User ID not found" });

    const newBoard = new Board({
      title,
      userId,
      description,
      //createdBy: userExists.username,
      visibility,
    });

    await newBoard.save();
    res.status(201).json({
      message: "Board created",
      data: {
        title: newBoard.title,
        description: newBoard.description,
        visibility: newBoard.visibility,
        createdBy: userExists.username,
      },
    });
  } catch (error) {
    console.error("Error saving board:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: `Validation Error: ${error.message}` });
    }
    res.status(500).json({ message: "Error saving board" });
  }
};

const boardPatch = async (req, res) => {
  try {
    const { title, description, visibility } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ message: "Invalid boardId: Must be a valid ObjectId" });

    const board = await Board.findById(id).populate("userId", "username");
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (!board.userId.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this board" });
    }

    board.title = title || board.title;
    board.description = description || board.description;
    board.visibility = visibility || board.visibility;

    await board.save();

    res.status(200).json({
      message: "Board updated",
      data: {
        _id: board._id,
        title: board.title,
        description: board.description,
        visibility: board.visibility,
        createdBy: board.userId.username
      } 
    });
  } catch (error) {
    console.error("Error updating board:", error);
    res.status(500).json({ message: "Error updating board" });
  }
};

const boardDelete = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Board ID" });
    }

    // Fetch the board, populating the userId to get the username
    const board = await Board.findById(id).populate("userId", "username");
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check authorization
    if (!board.userId.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: You do not own this board" });
    }

    listController.deleteAllByBoardId(id);
    // Delete the board itself
    await Board.findByIdAndDelete(id);

    // Send success response
    res.status(200).json({
      message: "Board deleted",
      data: {
        _id: board._id,
        title: board.title,
        description: board.description,
        visibility: board.visibility,
        createdBy: board.userId.username
      }
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error deleting board:", error.message || error);
    res.status(500).json({ message: "Error deleting board" });
  }
};

module.exports = {
  boardPost,
  boardGet,
  boardPatch,
  boardDelete,
  deleteListsMiddleware,
};
