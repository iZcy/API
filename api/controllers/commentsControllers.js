const Comments = require("../models/commentsModels");
const User = require("../models/userModels");
const Card = require("../models/cardModels");

const commentsGet = async (req, res) => {
  try {
    const data = await Comments.find();

    if (!data) {
      return res.status(404).json({ error: "Comment not found"});
    }

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
    // Body parsing
    // const { cardId, userId, content, isEdited } = req.body;
    const { cardId, userId, content } = req.body;
    // const { userId, content } = req.body;

    // Check body existance
    if (!cardId) {
      return res.status(400).json({ data: "cardId is required!"});
    }
    if (!userId) {
      return res.status(400).json({ data: "userId is required!"});
    }
    if (!content) {
      return res.status(400).json({ data: "content is required!"});
    }

    // Check if cardId exists
    const card_check = await Card.findOne({ _id: cardId });
    if (!card_check) {
      return res.status(400).json({ data: "cardId doesn't exist!"});
    }
    // Check if userId exists
    const user_check = await User.findOne({ _id: userId });
    if (!user_check) {
      return res.status(400).json({ data: "userId doesn't exist!"});
    }

    const newComments = new Comments({
      cardId,
      userId,
      content,
      // isEdited: false // Set isEdited to false when first created
      // isEdited
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
    // Body parsing
    // const { id, content } = req.body;
    // const { id, cardId, userId, content, isEdited } = req.body;
    const { id, cardId, userId, content } = req.body;
    const data = await Comments.findById(id);

    // Check body existance
    if (!id) {
      res.status(400).json({ data: "id is required!" });
    }
    if (!cardId) {
      res.status(400).json({ data: "cardId is required!" });
    }
    if (!userId) {
      res.status(400).json({ data: "userId is required!" });
    }
    if (!content) {
      res.status(400).json({ data: "content is required!" });
    }

    // Check if id exists
    const id_check = await Comments.findOne({ id });
    if (!id_check) {
      return res.status(400).json({ data: "id doesn't exist!"});
    }
    // Check if cardId exists
    const card_check = await Card.findOne({ _id: cardId });
    if (!card_check) {
      return res.status(400).json({ data: "cardId doesn't exist!"});
    }
    // Check if userId exists
    const user_check = await User.findOne({ _id: userdId });
    if (!user_check) {
      return res.status(400).json({ data: "userId doesn't exist!"});
    }

    // Check if data is returned
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
    // Body parsing
    const { id } = req.body;
    const result = await Comments.findByIdAndDelete(id);

    // Check bddy existance
    if (!id) {
      return res.status(404).json({ data: "id is required!" });
    }

    // Check if id exists
    const id_check = await Comments.findOne({ id });
    if (!id_check) {
      return res.status(400).json({ data: "id doesn't exist!"});
    }

    // Check if result is returned
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