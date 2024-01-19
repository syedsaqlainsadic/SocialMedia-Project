const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

router.get("/", (req, res) => {
  const pageData = {
    title: "Login Page",
  };
  res.setHeader("Cache-Control", "no-cache, no-store, multi-revalidate");
  res.status(200).render("login", pageData);
});

router.post("/", async (req, res) => {
  const pageData = req.body;
  pageData.title = "Login Page";
  const username = req.body.username.trim();
  const password = req.body.password.trim();
  if (username && password) {
    const user = await User.findOne({
      username: req.body.username.trim(),
    }).catch((err) => {
      console.log(err);
      pageData.errorMessage = "Something went wrong..";
      res.status(200).render("login", pageData);
    });
    if (user != null) {
      const result = await bcrypt.compare(password, user.password);
      if (result === true) {
        req.session.saqlain = user;
        return res.redirect("/home");
      } else {
        pageData.errorMessage = "Incorrect Password...";
        res.status(200).render("login", pageData);
      }
    } else {
      pageData.errorMessage = "Login Credential Incorrect..";
      res.status(200).render("login", pageData);
    }
  }
  pageData.errorMessage = "Make sure all the Field has a value";
  res.status(200).render("login", pageData);
});
module.exports = router;
