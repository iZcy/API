const jwt = require("jsonwebtoken");

const enums = require("../helper/enumerations");
const User = require("../models/userModels");

const cookieName = process.env.COOKIE_NAME;

const parseTokenData = async (req, res) => {
  const token = req.cookies[cookieName];

  if (!token) {
    return res.status(403).json({ message: "Unauthorized!" });
  }

  try {
    // Parse the JWT token
    const parseJwt = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER
    });

    // Fetch user data from the DB
    const userData = await User.findById(parseJwt.id);
    if (!userData) {
      return res.status(403).json({ message: "Forbidden!" });
    }

    // Attach the user data to the request
    req.user = userData;
    return null;
  } catch (err) {
    console.error("Error parsing token data:", err);
    // clear the cookie
    res.clearCookie(cookieName);
    return res.status(401).json({ message: "Token not valid" });
  }
};

const parseTokenDataMiddleware = async (req, res, next) => {
  const errorParse = await parseTokenData(req, res);
  if (errorParse) {
    return errorParse;
  }
  next();
};

// access control middleware is a function that takes a role and returns a middleware function
// the middleware function checks if the role is allowed to access the resource
// if the role is allowed, it calls the next middleware function
// if the role is not allowed, it sends a 403 status code
const allowedRole = (role) => {
  return async (req, res, next) => {
    // find index of the role in the roles array
    const roleIndex = enums.roleEnum.findIndex((r) => r === role);
    // if the role is not found, return a 403 status code
    if (roleIndex === -1) {
      return res.status(403).json({ data: "Forbidden" });
    }

    const errorParse = await parseTokenData(req, res);
    if (errorParse) {
      return errorParse;
    }

    const userRoleIndex = enums.roleEnum.findIndex((r) => r === req.user.role);

    // if the user role is not found, set it to the lowest role
    if (userRoleIndex === -1) {
      req.user.role = enums.roleEnum[0];
    }

    if (userRoleIndex >= roleIndex) {
      return next();
    } else {
      return res
        .status(403)
        .json({ data: "Forbidden access for role " + req.user.role });
    }
  };
};

module.exports = {
  allowedRole,
  parseTokenDataMiddleware
};
