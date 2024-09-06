const Task = require("../models/taskModels");

const taskGet = async (req, res) => {
  try {
    const data = await Task.find();
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting tasks");
  }
};

const taskPost = async (req, res) => {
  try {
    const { name } = req.body;
    const defaultStatus = "todo";

    const newTask = new Task({
      name,
      status: defaultStatus
    });

    await newTask.save();
    res.status(200).send(newTask + " saved");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving task");
  }
};

const taskPatch = async (req, res) => {
  try {
    const { id, status, name } = req.body;
    const data = await Task.findById(id);

    if (!data) {
      return res.status(404).send("Task not found");
    }

    data.status = status;
    data.name = name;
    await data.save();
    res.status(200).send(data + " updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating task");
  }
};

const taskDelete = async (req, res) => {
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
  taskGet,
  taskPost,
  taskPatch,
  taskDelete
};
