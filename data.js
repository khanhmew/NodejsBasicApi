const { ObjectId } = require("mongodb");
let mongoose = require("mongoose");
const listAccounts = [];
const listNewsFeed = [];

//define schema
const postSchema = new mongoose.Schema({
  id: ObjectId,
  title: String,
  content: String,
  author: String,
  data: String,
});


const userSchema = new mongoose.Schema({
  id: ObjectId,
  username: String,
  password: String,
  friends: Array,
});

//define model
const User = mongoose.model("User", userSchema);

const Post = mongoose.model("Post", postSchema);
module.exports=User;
module.exports=Post;
// Connect to the MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/basiSocialNetwrork")
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

module.exports = [listNewsFeed, listAccounts];
