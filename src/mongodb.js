const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/LoginSignUpTutorial") //to connect node to mongo db database
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
