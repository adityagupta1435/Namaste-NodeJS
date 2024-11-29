const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");

const USER_SAFE_DATA = "firstName lastName photoUrl age about skills";

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId.equals(loggedInUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({
      message: `Data fetched successfully!`,
      data: data,
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
      message: `Data fetched successfully!`,
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // In the feed api we will get all the users who have no status with the loggedinUser
    // Cannot see his own card

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //Find all the connection requests(sent + received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip) //skip and limit are used for pagination
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = userRouter;
