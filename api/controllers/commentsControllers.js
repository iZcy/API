const Comments = require("../models/commentsModels");
const User = require("../models/userModels");
const Card = require("../models/cardModels");
const { default: mongoose } = require("mongoose");

const deleteAllByCardId = async (cardId) => {
  try {
    await Comments.deleteMany({ cardId });
    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const commentsGet = async (req, res) => {
  try {
    // const data = await Comments.find();
    const data = await Comments.find().populate("userId", "username").exec();

    if (!data) return res.status(404).json({ error: "Comment not found" });

    res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error getting tasks" });
  }
};

const commnentsGetById = async (req, res) => {
  try {
    // Get the commenet id from the request param
    const { id } = req.params;

    // Check body existance
    if (!id) return res.status(400).json({ error: "id is required!" });

    // Check id data type
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ data: "id type must be ObjectId" });

    // Find the comment by the id
    // const comment = await Comments.findById(id);
    const comment = await Comments.findById(id).populate("userId", "username");

    // If no comment is found, return false
    if (!comment) return res.status(404).json({error: "Comment not found!"});

    // If success
    res.status(200).json({ data: comment});
  }
  catch (error) {
    console.log("Error retrieving comment by id:", error);

    // Return a 500 status if an error occurs
    res.status(500).json({ error: "Error retrieving comment"})
  }
}

const commentsGetByCardId = async (req, res) => {
  try {
    const { cardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(cardId)) return res.status(400).json({ error: "Invalid cardId! "});
    // const { content } = req.body;
    // const { _id: userId } = req.user;

    // Ensure the card ID is valid
    const card = await Card.findById(cardId);
    if (!card) return res.status(400).json({ data: "ID is not a valid Card ID." });

    // Fetch all comments for the specific card
    // const comments = await Comments.find();
    const comments = await Comments.find( {cardId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    // const filteredComments = comments.filter((comment) => comment.cardId == cardId);
    // console.log(filteredComments);

    // console.log(_id);

    // res.status(200).json({ data: filteredComments });
    res.status(200).json({ data: comments });
  } catch (error) {
    console.error("Error retrieving comments: ", error);
    res.status(500).json({
      data: "Failed to retrieve comments due to server error",
      details: error.message
    });
  }
}

const commentsPost = async (req, res) => {
  try {
    // Body parsing
    // const { cardId, userId, content, isEdited } = req.body;
    // const { cardId, userId, content } = req.body;
    const { cardId } = req.params;
    const { content } = req.body;
    const { _id: userId } = req.user;
    // const { userId, content } = req.body;

    // Check body existance
    if (!cardId) return res.status(400).json({ error: "cardId is required!" });
    if (!userId) return res.status(400).json({ error: "userId is required!" });
    if (!content)
      return res.status(400).json({ error: "content is required!" });

    // Check the data types
    if (!mongoose.Types.ObjectId.isValid(cardId))
      return res.status(400).json({ data: "cardId type must be ObjectId" });
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ data: "userId type must be ObjectId" });
    if (typeof content !== "string")
      return res.status(400).json({ data: "content type must be string" });

    // Check if cardId exists
    const card_check = await Card.findOne({ _id: cardId });
    if (!card_check)
      return res.status(400).json({ error: "cardId doesn't exist!" });

    // Check if userId exists
    const user_check = await User.findOne({ _id: userId });
    if (!user_check)
      return res.status(400).json({ error: "userId doesn't exist!" });

    const newComments = new Comments({
      cardId,
      userId,
      content
      // isEdited: false // Set isEdited to false when first created
      // isEdited
    });

    await newComments.save();
    res.status(201).json({ message: "Comment created", data: newComments });
  } catch (error) {
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
    if (!id) res.status(400).json({ error: "id is required!" });
    if (!cardId) res.status(400).json({ error: "cardId is required!" });
    if (!userId) res.status(400).json({ error: "userId is required!" });
    if (!content) res.status(400).json({ error: "content is required!" });

    // Check the data types
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ data: "id type must be ObjectId" });
    if (!mongoose.Types.ObjectId.isValid(cardId))
      return res.status(400).json({ data: "cardId type must be ObjectId" });
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ data: "userId type must be ObjectId" });
    if (typeof content !== "string")
      return res.status(400).json({ data: "content type must be string" });

    // Check if id exists
    const id_check = await Comments.findOne({ id });
    if (!id_check) return res.status(400).json({ error: "id doesn't exist!" });

    // Check if cardId exists
    const card_check = await Card.findOne({ _id: cardId });
    if (!card_check)
      return res.status(400).json({ error: "cardId doesn't exist!" });

    // Check if userId exists
    const user_check = await User.findOne({ _id: userdId });
    if (!user_check)
      return res.status(400).json({ error: "userId doesn't exist!" });

    // Check if data is returned
    if (!data) return res.status(404).json({ error: "Comments not found" });

    data.cardId = cardId;
    data.userId = userId;
    data.content = content;
    data.isEdited = true;

    await data.save();
    res.status(200).json({ message: "Comment updated", data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating comments" });
  }
};

const commentsDelete = async (req, res) => {
  try {
    // Body parsing
    const { id } = req.body;
    const result = await Comments.findByIdAndDelete(id);

    // Check bddy existance
    if (!id) return res.status(404).json({ error: "id is required!" });
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ data: "id type must be ObjectId" });

    // Check if id exists
    const id_check = await Comments.findOne({ id });
    if (!id_check) return res.status(400).json({ error: "id doesn't exist!" });

    // Check if result is returned
    if (!result) return res.status(404).json({ error: "Comment not found" });

    res.status(200).json({ message: "Comment deleted", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error deleting comments" });
  }
};

module.exports = {
  commentsGet,
  commentsPost,
  commentsPatch,
  commentsDelete,
  deleteAllByCardId,
  commentsGetById,
  commentsGetByCardId
};