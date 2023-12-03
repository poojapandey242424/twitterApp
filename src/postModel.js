// In a new file, like postModel.js

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  postTitle: {
    type: String,
    required: true,
  },
  postDescription: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
