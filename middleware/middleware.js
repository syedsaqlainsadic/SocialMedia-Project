exports.isAlreadyLogin = (req, res, next) => {
  if (req.session && req.session.saqlain) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

exports.isLogin = (req, res, next) => {
  if (req.session && req.session.saqlain) {
    return res.redirect("/home");
  } else {
    return next();
  }
};
