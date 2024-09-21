const Card = require('../models/cardModels');

// Create a new card
exports.createCard = async (req, res) => {
  try {
    const { title, description, listId, assignedTo, status, createdAt, dueDate } = req.body;
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
    res.status(400).send("Error creating card: " + error.message);
  }
};


// Get all cards
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.find().populate('assignedTo');  // Populate users
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a card
exports.updateCard = async (req, res) => {
  try {
    const { title, status } = req.body;
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.id,
      { title, status }, 
      { new: true } 
    );

    if (!updatedCard) return res.status(404).json({ message: 'Card not found' });

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Delete a card
exports.deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard) return res.status(404).json({ message: 'Card not found' });
    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
