const mongoose = require("mongoose");
const Lists = require("../models/listsModels");
const Boards = require("../models/boardModels");
const { deleteAllByListId } = require("./cardControllers");

const deleteAllByBoardId = async (boardId) => {
  try {
    // Find all list with the boardId
    const data = await List.find({ boardId });
    // map all the listId and kill all card
    data.map((list) => deleteAllByListId(list._id));
    // kill all list
    await List.deleteMany({ boardId });

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const listsGet = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role; // Assuming role is stored in req.user

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ data: "Invalid boardId: Must be a valid ObjectId" });
    }

    const boardExists = await Boards.findById(boardId);
    if (!boardExists) {
      return res.status(400).json({ data: "Board ID not found" });
    }

    let lists;

    if (userRole === "admin") {
      lists = await Lists.find({ boardId }).populate("boardId");
    } else if (userRole === "guest") {
      const publicCards = await Card.find({ status: "public" });
      const publicListIds = publicCards.map(card => card.listId);
      lists = await Lists.find({ _id: { $in: publicListIds }, boardId }).populate("boardId");
    } else if (userRole === "member") {
      const memberCards = await Card.find({ assignedTo: userId });
      const memberListIds = memberCards.map(card => card.listId);
      lists = await Lists.find({ 
        $or: [
          { _id: { $in: memberListIds } },
          { boardId }
        ]
      }).populate("boardId");
    }

    lists = lists.filter(list => list.boardId && list.boardId._id.toString() === boardId);
    res.status(200).json({ data: lists });
  } catch (error) {
    console.error("Error getting Lists: ", error);
    res.status(500).json({ data: `Error getting Lists: ${error.message}` });
  }
};

// const listsGet = async (req, res) => {
//   try {
//     const { boardId } = req.params;

//     // Check if boardId is not a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(boardId)) {
//       return res.status(400).json({ data: "Invalid boardId: Must be a valid ObjectId" });
//     }

//     // Check if boardId is valid
//     const boardExists = await Boards.findById(boardId);
//     if (!boardExists) {
//       return res.status(400).json({ data: "Board ID not found" });
//     }

//     // Find lists where boardId matches the provided boardId
//     let data = await Lists.find({ boardId }).populate("boardId");

//     data = data.filter(
//       (list) => list.boardId && list.boardId._id.toString() === boardId
//     );
//     res.status(200).json({ data });
//   } catch (error) {
//     console.error("Error getting Lists: ", error); // More detailed error log
//     res.status(500).json({ data: `Error getting Lists: ${error.message}` });
//   }
// };

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
    console.log("PATCH request received:", req.body); // Log request body
    const { id } = req.params;
    const { title, boardId, position } = req.body;

    if (!id) return res.status(400).json({ data: "ID is required" });

    const data = await Lists.findById(id);
    if (!data) {
      return res.status(404).json({ data: "List not found" });
    }

    if (title && typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });

    // Update logic
    data.title = title || data.title;
    data.boardId = boardId || data.boardId;
    data.position = position || data.position;

    await data.save();
    console.log("List updated successfully:", data); // Log hasil update
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