const Comments = require("../models/commentsModels");

const commentsGet = async (req, res) => {
  try {
    const data = await Comments.find();
    res.status(200).send(data);
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Error getting tasks");
  }
};

const commentsPost = async (req, res) => {
  try {
    const { cardId, userId, content } = req.body;

    const newComments = new Comments({
      cardId,
      userId,
      content,
      isEdited: false // Set isEdited to false when first created
    });
    await newComments.save();
    res.status(200).send(newComments + " saved");
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Error saving comments");
  }
};

const commentsPatch = async (req, res) => {
  try {
    const { id, content } = req.body;
    const data = await Comments.findById(id);

    if (!data) {
      return res.status(404).send("Comments not found");
    }

    data.content = content;
    data.isEdited = true;

    await data.save();
    res.status(200).send(data + " updated");
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Error updating comments");
  }
};

const commentsDelete = async (req, res) => {
  try {
    const { id } = req.body;
    await Comments.findByIdAndDelete(id);

    res.status(200).send("Task deleted");
  }
  catch (error) {
    console.log(error);
    res.status(500).send("Error deleting comments");
  }
};

module.exports = {
  commentsGet,
  commentsPost,
  commentsPatch,
  commentsDelete
};