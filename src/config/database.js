const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteNode:aC2AwnuT2PaG5jc2@namastenode.b0xsa.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
