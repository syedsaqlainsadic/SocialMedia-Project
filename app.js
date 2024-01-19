const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const session = require("express-session");
require("dotenv").config();

const connectDB = require("./db/connect");
const middleware = require("./middleware/middleware");

const app = express();
const port = process.env.PORT;

app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "saqlain",
    resave: true,
    saveUninitialized: false,
  })
);

const staticUri = path.join(__dirname, "public");
app.use(express.static(staticUri));

//Routes
const registerRoute = require("./routes/registerRoutes");
const loginRoute = require("./routes/loginRoutes");
const logoutRoute = require("./routes/logoutRoutes");
const bodyParser = require("body-parser");

app.use("/register", middleware.isLogin, registerRoute);
app.use("/login", middleware.isLogin, loginRoute);
app.use("/logout", logoutRoute);

//Home Page
app.get(["/", "/index", "/home"], middleware.isAlreadyLogin, (req, res) => {
  const pageData = {
    title: "Home Page",
    userDetails: req.session.saqlain,
    userDetailsJson: JSON.stringify(req.session.saqlain),
  };
  res.status(200).render("home", pageData);
});

//Settings
app.get("/settings", middleware.isAlreadyLogin, (req, res) => {
  const pageData = {
    title: "Settings",
    userDetails: req.session.saqlain,
  };
  res.status(200).render("settings", pageData);
});

//API routes
const postApiRoutes = require("./routes/api/posts");
app.use("/api/posts", postApiRoutes);

app.listen(port, () => {
  console.log(`Server is running i port ${port}`);
});
