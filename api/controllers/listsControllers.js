const List = require("../models/listsModels");

const listsGet = async (req, res) => {
  try {
    const data = await Task.find();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting tasks");
  }
};

const listsPost = async (req, res) => {
  try {
    const { listId, title, boardId, position, createdBy } = req.body;

    const newTask = new Task({
      listId,
      title,
      boardId,
      position,
      createdBy
    });

    await newTask.save();
    res.status(200).send(newTask + " saved");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving task");
  }
};

const listsPatch = async (req, res) => {
  try {
    const { id, listId, title, boardId, position, createdBy } = req.body;
    const data = await Task.findById(id);

    if (!data) {
      return res.status(404).send("Task not found");
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
    res.status(500).send("Error updating task");
  }
};

const listsDelete = async (req, res) => {
  try {
    const { id } = req.body;
    await Task.findByIdAndDelete(id);

    res.status(200).send("Task deleted");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting task");
  }
};

module.exports = {
  listsGet,
  listsPost,
  listsPatch,
  listsDelete
};
