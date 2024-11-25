const Card = require("../models/cardModels");
const List = require("../models/listsModels");
const { deleteAllByCardId } = require("./commentsControllers");

const deleteAllByListId = async (listId) => {
  try {
    // Find all card with the listId
    const data = await Card.find({ listId });
    // map all the cardId and kill all comment
    data.map((card) => commentController.deleteAllByCardId(card._id));
    // kill all card
    await Card.deleteMany({ listId });

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Create a new card
const cardsPost = async (req, res) => {
  try {
    const { listId } = req.params;

    const { title, description, assignedTo, status, createdAt, dueDate } =
      req.body;

    // Check body existence
    if (!title) return res.status(400).json({ data: "Title is required." });
    if (!description) return res.status(400).json({ data: "Description is required." });
    if (!listId) return res.status(400).json({ data: "List ID is required." });
    if (!assignedTo) return res.status(400).json({ data: "Assigned To is required." });
    if (!createdAt) return res.status(400).json({ data: "Created At is required." });
    if (!dueDate) return res.status(400).json({ data: "Due Date is required." });

    // Check the data types
    const list = await List.findById(listId);
    if (!list)
      return res.status(400).json({ data: "ID is not a valid List ID." });

    if (!Array.isArray(assignedTo))
      return res.status(400).json({ error: "Assigned To must be an array" });

    const newCard = new Card({
      title,
      description,
      listId,
      assignedTo,
      status,
      createdAt,
      dueDate
    });

    const savedCard = await newCard.save();
    res.status(201).json(savedCard);
  } catch (error) {
    console.log(error);
    res.status(400).json({ data: "Error creating card" });
  }
};

// Get all cards
const cardsGet = async (req, res) => {
  try {
    const { listId } = req.params;
    // ensure listId is valid
    const list = await List.findById(listId);
    if (!list)
      return res.status(400).json({ data: "ID is not a valid List ID." });

    const cards = await Card.find().populate("assignedTo"); // Populate users

    // Filter
    const filteredCards = cards.filter((card) => card.listId == listId);

    res.status(200).json({ data: filteredCards });
  } catch (error) {
    console.error("Error retrieving cards:", error); // Log the actual error
    res.status(500).json({
      data: "Failed to retrieve cards due to server error",
      details: error.message
    });
  }
};

// Update a card
const cardsPatch = async (req, res) => {
  try {
    const { title, status, description, assignedTo } = req.body;

    console.log("Request body:", req.body);

    // Check body existence
    if (!title && !status && !description  && !assignedTo)
      return res.status(400).json({
        error: "At least one field (title, status, description or assignedTo) is required to update."
      });

    // Check if the card ID is valid
    if (!req.params.id)
      return res.status(400).json({
        message: "Invalid card ID."
      });

    // Validate assignedTo as array of ObjectId
    if (assignedTo && !Array.isArray(assignedTo)) {
      console.log("Error: assignedTo should be an array of ObjectIds.");
      return res.status(400).json({
        error: "assignedTo should be an array of ObjectIds."
      });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { title, status, description, assignedTo },
      { new: true }
    );

    if (!updatedCard) return res.status(404).json({ data: "Card not found" });

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(400).json({ data: "Cannot update card" });
  }
};

// Delete a card
const cardsDelete = async (req, res) => {
  try {
    const cardId = req.params.id;

    // Check if the card ID is provided
    if (!cardId) return res.status(400).json({ error: "Card ID is required." });

    // Check if the card ID is valid
    const card = await Card.findById(cardId);
    if (!card)
      return res.status(400).json({ data: "ID is not a valid Card ID." });

    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard)
      return res.status(404).json({ message: "Card not found" });
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ data: "Failed to delete card" });
  }
};

module.exports = {
  cardsPost,
  cardsGet,
  cardsPatch,
  cardsDelete,
  deleteAllByListId,
  cardsDelete
};
