// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3500;

// MongoDB connection
const dbURI = process.env.DB_URI; // Replace with your MongoDB URI
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", require("./routes/taskRoutes"));
app.use("/task", require("./routes/taskRoutes"));
app.use("/info", require("./routes/infoRoutes"));
app.use("/board", require("./routes/boardRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/lists", require("./routes/listsRoutes"));
app.use("/comments", require("./routes/commentsRoutes"));
app.use("/cards", require("./routes/cardRoutes"))

// Start the server
app.listen(PORT, () => {
  console.log(`Welcome to KanbanAPI`);
  console.log(`Server is running on port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV}`);
});
