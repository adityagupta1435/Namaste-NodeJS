const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  try {
    console.log("Send Connection Request");
    res.send("Connection Request Sent!");
  } catch (err) {
    res.status(400).send("ERROR: ", err.message);
  }
});

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      //Only interested and inored status is accepted
      if (!["interested", "ignored"].includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      //Check whether toUser exist in the db
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: `User does not exists!`,
        });
      }
      //if there is existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          message: "Connection Request already Exists!",
        });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} sent ${status} request to ${toUser.firstName} `,
      });
    } catch (err) {
      res.status(400).send("ERROR: ", err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const toUserId = loggedInUser._id;

      //Validation for status
      const { status, requestId } = req.params;
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({
          message: "Status not allowed!",
        });
      }

      //Check for RequestId
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: toUserId,
        status: "interested", //Only interested request will be entertained
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection Request not found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: `Connection request ${status} , ${data}`,
      });
    } catch (err) {
      res.status(400).send("ERROR: ", err.message);
    }
  }
);

module.exports = requestRouter;
