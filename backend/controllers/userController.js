const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateJwt");

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Email inconnu");
    error.status = 404;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    const error = new Error("Mot de passe incorrect");
    error.status = 401;
    throw error;
  }

  const token = generateToken(user._id, user.userName, user.email);

  return token;
};
