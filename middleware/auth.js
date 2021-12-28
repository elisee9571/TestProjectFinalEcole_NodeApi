const session = require("express-session");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.session.token;
    const decodedToken = jwt.verify(token, "TOKEN_SECRET");
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      return res.status(400).json({ message: "User Id invalid!" }); // Bad Request
    } else {
      next();
    }
  } catch (err) {
    res.status(401).json({ message: "Unauthenticated request" }); // Unauthorized
  }
};
