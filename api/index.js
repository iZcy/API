// server.js
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3500;

// MongoDB connection
const dbURI =
  "mongodb+srv://kanbanpemweb22:XrrmKiflnQjoOVN3@kanbancluster.jndpg.mongodb.net/Task"; // Replace with your MongoDB URI
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Middleware
app.use(express.json());

app.use("/", require("./routes/taskRoutes"));
app.use("/task", require("./routes/taskRoutes"));
app.use("/info", require("./routes/infoRoutes"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
