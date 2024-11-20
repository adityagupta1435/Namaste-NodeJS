const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//unique connections
ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

//Before Saving pre method will be called
ConnectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if the fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  ConnectionRequestSchema
);
module.exports = ConnectionRequestModel;
