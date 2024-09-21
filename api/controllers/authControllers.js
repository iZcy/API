const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const enums = require("../helper/enumerations");

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

    // Check Body Existence
    if (!username)
      return res.status(400).json({ data: "Username is required" });

    if (!email) return res.status(400).json({ data: "Email is required" });

    if (!role) return res.status(400).json({ data: "Role is required" });

    if (!password)
      return res.status(400).json({ data: "Password is required" });

    // Check Body Validity
    const usernameTooShort = username.length < 6;
    const usernameWrongType = typeof username !== "string";
    if (usernameWrongType) {
      return res.status(400).json({ data: "Invalid username: Wrong Type" });
    }
    if (usernameTooShort) {
      return res.status(400).json({ data: "Invalid username: Too Short" });
    }

    const emailTooShort = email.length < 6;
    const emailWrongType = typeof email !== "string";
    if (emailWrongType) {
      return res.status(400).json({ data: "Invalid email: Wrong Type" });
    }
    if (emailTooShort) {
      return res.status(400).json({ data: "Invalid email: Too Short" });
    }

    const passwordTooShort = password.length < 6;
    const passwordWrongType = typeof password !== "string";
    if (passwordWrongType) {
      return res.status(400).json({ data: "Invalid password: Wrong Type" });
    }
    if (passwordTooShort) {
      return res.status(400).json({ data: "Invalid password: Too Short" });
    }

    const roleWrongType = typeof role !== "string";
    const roleNotInEnum = !enums.roleEnum.includes(role);
    if (roleWrongType) {
      return res.status(400).json({ data: "Invalid role: Wrong Type" });
    }
    if (roleNotInEnum) {
      return res.status(400).json({ data: "Invalid role: Invalid Variant" });
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

const userLogin = async (req, res) => {
  try {
    // Body parsing
    const { email, password } = req.body;

    // Check Body Existence
    if (!email) return res.status(400).json({ data: "Email is required" });

    if (!password)
      return res.status(400).json({ data: "Password is required" });

    // Check Body Validity
    const emailTooShort = email.length < 6;
    const emailWrongType = typeof email !== "string";
    if (emailWrongType) {
      return res.status(400).json({ data: "Invalid email: Wrong Type" });
    }
    if (emailTooShort) {
      return res.status(400).json({ data: "Invalid email: Too Short" });
    }

    const passwordTooShort = password.length < 6;
    const passwordWrongType = typeof password !== "string";
    if (passwordWrongType) {
      return res.status(400).json({ data: "Invalid password: Wrong Type" });
    }
    if (passwordTooShort) {
      return res.status(400).json({ data: "Invalid password: Too Short" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ data: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ data: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
        issuer: process.env.JWT_ISSUER
      }
    );

    res
      .status(200)
      .cookie("token", token, cookiesOptionsGen())
      .json({ data: "Logged in" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error logging in" });
  }
};

module.exports = {
  userRegister,
  userLogin
};
