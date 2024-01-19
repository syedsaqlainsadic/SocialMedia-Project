const express = require("express");
const app = express();
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

router.get("/", (req, res) => {
  const pageData = {
    title: "Registeration",
  };
  res.setHeader("Cache-Control", "no-cache, no-store, multi-revalidate");
  res.status(200).render("register", pageData);
});

router.post("/", async (req, res) => {
  const pageData = req.body;
  pageData.title = "Registeration";

  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  if (name && email && username && password) {
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((err) => {
      console.log(err);
      pageData.errorMessage = "Something went wrong...";
      res.status(200).render("register", pageData);
    });
    if (user == null) {
      const data = req.body;
      data.password = await bcrypt.hash(password, 10);
      User.create(data).then((user) => {
        //return res.status(201).json(user);
        req.session.saqlain = user;
        return res.redirect("/home");
      });
    } else {
      pageData.errorMessage = "Username or email already available..";
      res.status(200).render("register", pageData);
    }
  } else {
    pageData.errorMessage = "Make sure all field are filled";
    res.status(200).render("register", pageData);
  }
});

module.exports = router;
