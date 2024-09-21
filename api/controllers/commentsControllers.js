const Comments = require("../models/commentsModels");

const commentsGet = async (req, res) => {
  try {
    const data = await Comments.find();
    // res.status(200).send(data);
    res.status(200).json({ data });
  }
  catch (error) {
    console.log(error);
    // res.status(500).send("Error getting tasks");
    res.status(500).json({ error: "Error getting tasks" });
  }
};

const commentsPost = async (req, res) => {
  try {
    const { cardId, userId, content, isEdited } = req.body;

    const newComments = new Comments({
      cardId,
      userId,
      content,
      // isEdited: false // Set isEdited to false when first created
      isEdited// Set isEdited to false when first created
    });
    await newComments.save();
    // res.status(200).send(newComments + " saved");
    res.status(201).json({ data: "Comment created", comment: newComments });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error saving comments" });
  }
};

const commentsPatch = async (req, res) => {
  try {
    // const { id, content } = req.body;
    const { id, cardId, userId, content, isEdited } = req.body;
    const data = await Comments.findById(id);

    if (!data) {
      return res.status(404).json({ error: "Comments not found" });
    }
    
    data.cardId = cardId;
    data.userId = userId;
    data.content = content;
    data.isEdited = true;

    await data.save();
    // res.status(200).send(data + " updated");
    res.status(200).json({ data: "Comment updated", comment: data });
  }
  catch (error) {
    console.log(error);
    // res.status(500).send("Error updating comments");
    res.status(500).json({ error: "Error updating comments" });
  }
};

const commentsDelete = async (req, res) => {
  try {
    const { id } = req.body;
    await Comments.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // res.status(200).send("Task deleted");
    res.status(200).json({ data: "Comment deleted" });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting comments" });
  }
};

module.exports = {
  commentsGet,
  commentsPost,
  commentsPatch,
  commentsDelete
};