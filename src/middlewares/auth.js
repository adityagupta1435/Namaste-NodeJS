const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    //Read the token from the request cookies
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid!!");
    }

    //validate the token
    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodedObj;

    //Find the user
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new Error("User not found");
    }

    //We will do this so that we get to know logged in user
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
