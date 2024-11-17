const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    console.log("Send Connection Request");
    res.send("Connection Request Sent!");
  } catch (err) {
    res.status(400).send("ERROR: ", err.message);
  }
});

module.exports = requestRouter;
