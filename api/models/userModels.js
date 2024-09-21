const mongoose = require("mongoose");
const roleEnum = require("../helper/enumerations");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: [String],
    required: true,
    validate: {
      validator: function (roles) {
        // Ensure each role in the array is valid
        return roles.every((role) => roleEnum.includes(role));
      },
      message: (props) => `${props.value} contains an invalid role`
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
