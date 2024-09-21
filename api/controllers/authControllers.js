const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const roleEnum = require("../helpers/enumerations");

//domain check
const cookiesOptionsGen = () => {
  const settings = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    domain:
      process.env.NODE_ENV === "development" ? "localhost" : process.env.FE_URL,
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000
  };

  return settings;
};

const userRegister = async (req, res) => {
  try {
    // Body parsing
    const { username, email, password, role } = req.body;

    // Check Body Validity
    const usernameTooShort = username.length < 6;
    const usernameWrongType = typeof username !== "string";
    if (usernameWrongType) {
      return res.status(400).json({ data: "Invalid username" });
    }
    if (usernameTooShort) {
      return res.status(400).json({ data: "Invalid username" });
    }

    const emailTooShort = email.length < 6;
    const emailWrongType = typeof email !== "string";
    if (emailWrongType) {
      return res.status(400).json({ data: "Invalid email" });
    }
    if (emailTooShort) {
      return res.status(400).json({ data: "Invalid email" });
    }

    const passwordTooShort = password.length < 6;
    const passwordWrongType = typeof password !== "string";
    if (passwordWrongType) {
      return res.status(400).json({ data: "Invalid password" });
    }
    if (passwordTooShort) {
      return res.status(400).json({ data: "Invalid password" });
    }

    const roleTooShort = role.length < 3;
    const roleWrongType = typeof role !== "string";
    const roleNotInEnum = !roleEnum.includes(role);
    if (roleWrongType) {
      return res.status(400).json({ data: "Invalid role" });
    }
    if (roleTooShort) {
      return res.status(400).json({ data: "Invalid role" });
    }
    if (roleNotInEnum) {
      return res.status(400).json({ data: "Invalid role" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ data: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      passwordHash,
      role
    });

    await newUser.save();
    res.status(200).json({ data: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error creating user" });
  }
};

module.exports = {
  userRegister
};
