const mongoose = require("mongoose");
const Lists = require("../models/listsModels");
const Cards = require("../models/cardModels");
const Comment = require('../models/commentsModels');

// GET all cards
const cardsGet = async (req, res) => {
  try {
    const data = await Cards.find().populate("assignedTo"); // Populate assigned users
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error getting Cards");
  }
};

// POST a new card
const cardsPost = async (req, res) => {
  try {
    const { title, description, listId, assignedTo, status, createdAt, dueDate } = req.body;

    if (!title) return res.status(400).json({ data: "Title is required" });
    if (!description) return res.status(400).json({ data: "Description is required" });
    if (!listId) return res.status(400).json({ data: "List ID is required" });
    
    if (!mongoose.Types.ObjectId.isValid(listId))
      return res.status(400).json({ data: "Invalid listId: Must be a valid ObjectId" });

    const listExists = await Lists.findById(listId);
    if (!listExists) {
      return res.status(400).json({ data: "List ID not found" });
    }

    const newCard = new Cards({
      title,
      description,
      listId,
      assignedTo,
      status,
      createdAt,
      dueDate
    });

    await newCard.save();
    res.status(201).json({ data: "Card created", card: newCard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error saving Card" });
  }
};

// PATCH an existing card
const cardsPatch = async (req, res) => {
  try {
    const { id, title, description, listId, assignedTo, status, dueDate } = req.body;

    if (!id) return res.status(400).json({ data: "ID is required" });

    const data = await Cards.findById(id);
    if (!data) {
      return res.status(404).json({ data: "Card not found" });
    }

    if (title && typeof title !== "string")
      return res.status(400).json({ data: "Invalid title: Wrong Type" });

    if (listId) {
      if (!mongoose.Types.ObjectId.isValid(listId))
        return res.status(400).json({ data: "Invalid listId: Must be a valid ObjectId" });

      const listExists = await Lists.findById(listId);
      if (!listExists) {
        return res.status(400).json({ data: "List ID not found" });
      }
    }

    data.title = title || data.title;
    data.description = description || data.description;
    data.listId = listId || data.listId;
    data.assignedTo = assignedTo || data.assignedTo;
    data.status = status || data.status;
    data.dueDate = dueDate || data.dueDate;

    await data.save();
    res.status(200).json({ data: "Card updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error updating Card" });
  }
};

// DELETE a card and related comments
const cardsDelete = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.status(400).json({ data: "ID is required" });

    const card = await Cards.findById(id);
    if (!card) {
      return res.status(404).json({ data: "Card not found" });
    }

    // Delete all related comments
    await Comment.deleteMany({ cardId: id }); // Ensure the Comment model has a field cardId

    // Delete the card itself
    await Cards.findByIdAndDelete(id);
    res.status(200).json({ data: "Card and related comments deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error deleting Card" });
  }
};

module.exports = {
  cardsGet,
  cardsPost,
  cardsPatch,
  cardsDelete,
};