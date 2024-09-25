const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const enums = require("../helper/enumerations");
const accessControl = require("../middleware/accessControl");

const cookieName = process.env.COOKIE_NAME;

//domain check
const cookiesOptionsGen = () => {
  const settings = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    domain:
      process.env.NODE_ENV === "development" ? "localhost" : process.env.FE_URL,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 24 * 60 * 60 * 1000
  };

  return settings;
};

const nonAdminConstraint = async (
  userData,
  accountToAction,
  email,
  password
) => {
  const isNotAdmin = userData.role !== "admin";
  const isTargetAdmin = accountToAction.role === "admin";
  if (isNotAdmin || isTargetAdmin) {
    // Check if current user is the account owner
    if (userData.email !== email) {
      return res.status(400).json({ data: "This account is not yours" });
    }

    if (!password)
      return res.status(400).json({ data: "Password is required" });

    const passwordTooShort = password.length < 6;
    const passwordWrongType = typeof password !== "string";
    if (passwordWrongType) {
      return res.status(400).json({ data: "Invalid password: Wrong Type" });
    }
    if (passwordTooShort) {
      return res.status(400).json({ data: "Invalid password: Too Short" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ data: "Invalid password" });
    }
  }
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

    // Use middleware to check if user is allowed to register
    // admin can only be registered by admin
    // guest can regiester themselves (without credentials)
    // member is a promoted guest, yet can't register themselves and can't promote others

    if (role !== "guest") {
      const response = await accessControl.allowedRole("admin")(
        req,
        res,
        () => {}
      );

      // if the response is sent, return
      if (response) return response;
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
    // If cookies exist, remove them
    if (req.cookies) {
      res.clearCookie(cookieName, cookiesOptionsGen());
    }

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
      .json({
        data: "Logged in",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
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

    // If the to delete user is an admin, only himself can delete by providing the password
    const resp = await nonAdminConstraint(userData, user, email, password);
    if (resp) return resp;

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
    const userData = req.user;

    // if userData is not found, return 403
    if (!userData) {
      return res.status(403).json({ data: "Forbidden to delete!" });
    }

    // Check Body Existence
    if (!email) return res.status(400).json({ data: "Email is required" });

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ data: "User does not exist" });
    }

    // If the to delete user is an admin, only himself can delete by providing the password
    const resp = await nonAdminConstraint(userData, user, email, password);
    if (resp) return resp;

    await User.deleteOne({ email });
    // Logout if the user is deleting himself
    if (userData.email === email) {
      res.clearCookie(cookieName, cookiesOptionsGen());
    }

    res.status(200).json({ data: "User deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error deleting user" });
  }
};

const userUpdate = async (req, res) => {
  try {
    // Body parsing
    const { email, password, username, role } = req.body;

    // Check Body Existence
    if (!email) return res.status(400).json({ data: "Email is required" });

    // Check if there exist at least one field to update
    if (!username && !role) {
      return res.status(400).json({ data: "No field to update" });
    }

    // Check if there's an unknown field
    if (
      Object.keys(req.body).some(
        (key) => !["email", "username", "role", "password"].includes(key)
      )
    ) {
      return res.status(400).json({ data: "Unknown field to update" });
    }

    // Check Body Validity
    const emailTooShort = email.length < 6;
    const emailWrongType = typeof email !== "string";
    if (emailWrongType) {
      return res.status(400).json({ data: "Invalid email: Wrong Type" });
    }
    if (emailTooShort) {
      return res.status(400).json({ data: "Invalid email: Too Short" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ data: "User does not exist" });
    }

    // If the to delete user is an admin, only himself can delete by providing the password
    const resp = await nonAdminConstraint(userData, user, email, password);
    if (resp) return resp;

    if (username) {
      const usernameTooShort = username.length < 6;
      const usernameWrongType = typeof username !== "string";
      if (usernameWrongType) {
        return res.status(400).json({ data: "Invalid username: Wrong Type" });
      }
      if (usernameTooShort) {
        return res.status(400).json({ data: "Invalid username: Too Short" });
      }
      await User.updateOne({ email }, { username });
    }

    if (role) {
      const roleWrongType = typeof role !== "string";
      const roleNotInEnum = !enums.roleEnum.includes(role);
      if (roleWrongType) {
        return res.status(400).json({ data: "Invalid role: Wrong Type" });
      }
      if (roleNotInEnum) {
        return res.status(400).json({ data: "Invalid role: Invalid Variant" });
      }
      await User.updateOne({ email }, { role });
    }

    res.status(200).json({ data: "User updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Error updating user" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  userRole,
  userChangePassword,
  userDelete,
  userUpdate
};
