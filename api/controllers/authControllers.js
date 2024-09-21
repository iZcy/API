const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const enums = require("../helper/enumerations");

const cookieName = "kanbanapitoken";

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

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
        issuer: process.env.JWT_ISSUER
      }
    );

    // Send token
    res
      .status(200)
      .cookie(cookieName, token, cookiesOptionsGen())
      .json({ data: "Logged in" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error logging in" });
  }
};

const userLogout = async (req, res) => {
  try {
    // Check if cookie exists
    res.clearCookie(cookieName, cookiesOptionsGen());
    res.status(200).json({ data: "Logged out" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error logging out" });
  }
};

const userRole = async (req, res) => {
  try {
    // Check if cookie exists
    if (!req.cookies) {
      return res
        .status(400)
        .json({ data: "No token found: Cookies unavailable" });
    }

    // Check if token exists
    const token = req.cookies[cookieName];
    if (!token) {
      return res
        .status(400)
        .json({ data: "No token found: Cookie name unavailable" });
    }

    // Check if token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER
    });

    if (!decoded) return res.status(400).json({ data: "Invalid token" });

    // Return role
    res.status(200).json({ data: { role: decoded.role } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error getting role" });
  }
};

const userChangePassword = async (req, res) => {
  try {
    // Body parsing
    const { email, oldPassword, newPassword } = req.body;

    // Check Body Existence
    if (!email) return res.status(400).json({ data: "Email is required" });

    if (!oldPassword)
      return res.status(400).json({ data: "Old password is required" });

    if (!newPassword)
      return res.status(400).json({ data: "New password is required" });

    // Check Body Validity
    const emailTooShort = email.length < 6;
    const emailWrongType = typeof email !== "string";
    if (emailWrongType) {
      return res.status(400).json({ data: "Invalid email: Wrong Type" });
    }
    if (emailTooShort) {
      return res.status(400).json({ data: "Invalid email: Too Short" });
    }

    const oldPasswordTooShort = oldPassword.length < 6;
    const oldPasswordWrongType = typeof oldPassword !== "string";
    if (oldPasswordWrongType) {
      return res.status(400).json({ data: "Invalid old password: Wrong Type" });
    }
    if (oldPasswordTooShort) {
      return res.status(400).json({ data: "Invalid old password: Too Short" });
    }

    const newPasswordTooShort = newPassword.length < 6;
    const newPasswordWrongType = typeof newPassword !== "string";
    if (newPasswordWrongType) {
      return res.status(400).json({ data: "Invalid new password: Wrong Type" });
    }
    if (newPasswordTooShort) {
      return res.status(400).json({ data: "Invalid new password: Too Short" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ data: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ data: "Invalid old password" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email }, { passwordHash });
    res.status(200).json({ data: "Password changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error changing password" });
  }
};

const userDelete = async (req, res) => {
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

    await User.deleteOne({ email });
    res.status(200).json({ data: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error deleting user" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  userRole,
  userChangePassword,
  userDelete
};
