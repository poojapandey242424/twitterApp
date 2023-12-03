const express = require("express"); //this will require the express
const app = express(); //it will start the express.js
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");

hbs.registerHelper("eq", function (arg1, arg2) {
  return arg1 == arg2;
});
const collection = require("./mongodb");
const Post = require("./postModel"); // Path to your Post model

const templatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", async (req, res) => {
  const user = req.cookies && req.cookies["twitterCookie"];
  console.log("THE COOKIES IS ", req?.cookies["twitterCookie"]);
  console.log("THE USER IS ", user);
  let userWithTopic = await collection.findOne({ name: user });
  if (user == null) {
    res.redirect("/login");
  } else {
    const postsData = await Post.find({ topic: { $in: userWithTopic.topic } });
    res.render("home", {
      posts: postsData,
      userName: user,
      topics: userWithTopic.topic,
    });
  }
});

app.get("/posts", (req, res) => {
  res.render("posts");
});

app.post("/posts", async (req, res) => {
  const posts = {
    postTitle: req.body.postTitle,
    postDescription: req.body.postDescription,
    topic: req.body.topic,
  };
  await Post.create(posts);
  const postsData = await Post.find({});
  const user = req.cookies && req.cookies["twitterCookie"];
  let userWithTopic = await collection.findOne({ name: user });
  res.render("home", {
    posts: postsData,
    userName: user,
    topics: userWithTopic.topic,
  });
});

//to check whether the name is present in the database

app.post("/login", async (req, res) => {
  try {
    let user = await collection.findOne({ name: req.body.name });

    if (user) {
      console.log("USER EXISTS, APPENDING RANDOM NUMBER");
      user.name = user.name + Math.floor(Math.random() * 10000);
      // You may want to update the user in the database here if needed
    } else {
      console.log("USER IS NEW, CREATING");
      // User does not exist, create new user
      user = {
        name: req.body.name,
        topics: Array.isArray(req.body.topic)
          ? req.body.topic
          : [req.body.topic].filter(Boolean),
      };
      await collection.insertMany([user]);
    }

    // Fetch posts related to the user's topics

    const posts = await Promise.all(
      user.topics.map(async (topic) => {
        return {
          topic,
          posts: await Post.find({ topic }).lean(),
        };
      })
    );

    res.cookie("twitterCookie", user.name, { maxAge: 1 * 60000 });
    res.render("home", {
      userName: user.name,
      topics: user.topics,
      posts,
    });
  } catch (error) {
    res.send("An error occurred");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(3000, () => {
  console.log("port has been connected");
});
