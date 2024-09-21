const List = require("../models/listsModels");

const listsGet = async (req, res) => {
  try {
    const data = await Lists.find();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting Lists");
  }
};

const listsPost = async (req, res) => {
  try {
    const { listId, title, boardId, position, createdBy } = req.body;

    const newLists = new Lists({
      listId,
      title,
      boardId,
      position,
      createdBy
    });

    await newLists.save();
    res.status(200).send(newLists + " saved");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving Lists");
  }
};

const listsPatch = async (req, res) => {
  try {
    const { id, listId, title, boardId, position, createdBy } = req.body;
    const data = await Lists.findById(id);

    if (!data) {
      return res.status(404).send("Lists not found");
    }

    data.listId = listId || data.listId;
    data.title = title || data.title;
    data.boardId = boardId || data.boardId;
    data.position = position || data.position;
    data.createdBy = createdBy || data.createdBy;
    await data.save();

    res.status(200).send(data + " updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating Lists");
  }
};

const listsDelete = async (req, res) => {
  try {
    const { id } = req.body;
    await Lists.findByIdAndDelete(id);

    res.status(200).send("Lists deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting Lists");
  }
};

module.exports = {
  listsGet,
  listsPost,
  listsPatch,
  listsDelete
};
