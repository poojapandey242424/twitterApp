const mongoose = require("mongoose");
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI) //to connect node to mongo db database
  .then(() => {
    console.log("mongo connected");
  })
  .catch(() => {
    console.log("failed to connect");
  });

const LoginInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  topics: [String], // Array of strings to store topics
});

const collection = new mongoose.model("Collection1", LoginInSchema);
module.exports = collection;
