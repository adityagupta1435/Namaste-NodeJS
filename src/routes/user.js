const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    });

    console.log(connectionRequest);
    res.json({
      message: `All user Connections are ${connectionRequest}`,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//Get all the pending connection request of loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl age gender skills");
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: `Data etched successfully!`,
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = userRouter;
