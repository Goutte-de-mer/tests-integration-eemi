const jwt = require("jsonwebtoken");

const generateToken = (userId, userName, email) => {
  token = jwt.sign({ userName, userId, email }, process.env.TOKEN_SECRET, {
    expiresIn: "7h",
  });
  return token;
};

module.exports = { generateToken };
