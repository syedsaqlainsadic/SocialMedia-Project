const express = require("express");
const router = express.Router();

const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

//To get all post details

router.get("/", (req, res) => {
  Post.find()
    .populate("postedBy")
    .sort({ createdAt: 1 })
    .then((results) => {
      return res.status(200).send(results);
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(400);
    });
});

//To save post Details
router.post("/", async (req, res) => {
  if (!req.body.content) {
    console.log("Content Not Found");
    return res.sendStatus(400);
  }
  const postData = {
    content: req.body.content,
    postedBy: req.session.saqlain,
  };

  Post.create(postData).then(async (newPost) => {
    newPost = await User.populate(newPost, { path: "postedBy" });
    return res.status(200).send(newPost);
  });
});

//Like Post

router.put("/:id/like", async (req, res) => {
  const postId = req.params.id;
  const userId = req.session.saqlain._id;
  const isLiked =
    req.session.saqlain.likes && req.session.saqlain.likes.includes(postId);
  const option = isLiked ? "$pull" : "$addToSet";

  req.session.saqlain = await User.findByIdAndUpdate(
    userId,
    { [option]: { likes: postId } },
    { new: true }
  ).catch((err) => {
    console.log(err);
    req.sendStatus(400);
  });

  const post = await Post.findByIdAndUpdate(
    postId,
    { [option]: { likes: userId } },
    { new: true }
  ).catch((err) => {
    console.log(err);
    req.sendStatus(400);
  });

  res.status(200).send(post);
});

module.exports = router;
