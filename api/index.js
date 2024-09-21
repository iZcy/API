// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3500;

// CORS
const corsOptions = require("./helper/corsOptions");

// Logger
let morganLoggerMiddlewareForDevelopment;
if (process.env.NODE_ENV === "development") {
  morganLoggerMiddlewareForDevelopment = require("./middleware/morganMiddleware");
}

switch (process.env.NODE_ENV) {
  case "development":
    morganLoggerMiddlewareForDevelopment(app);
    break;
  case "production":
    break;
  default:
    break;
}

// MongoDB connection
const dbURI = process.env.DB_URI; // Replace with your MongoDB URI
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
app.use("/", require("./routes/taskRoutes"));
app.use("/task", require("./routes/taskRoutes"));
app.use("/info", require("./routes/infoRoutes"));
app.use("/board", require("./routes/boardRoutes"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/lists", require("./routes/listsRoutes"));
app.use("/comments", require("./routes/commentsRoutes"));
app.use("/cards", require("./routes/cardRoutes"))
app.use("/lists", require("./routes/listsRoutes"));
app.use("/comments", require("./routes/commentsRoutes"));

// Start the server
app.listen(PORT, () => {
  console.log(`Welcome to KanbanAPI`);
  console.log(`Server is running on port ${PORT}`);
  console.log(`Mode: ${process.env.NODE_ENV}`);
});
