const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const passport = require("passport");

// SIGN UP
exports.user_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up-form", {
    title: "Sign Up to Clubhouse",
  });
});

exports.user_sign_up_post = asyncHandler(async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    try {
      const user = new User({
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        password: hashedPassword,
      });
      const result = await user.save();
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  });
});

//SIGN IN

exports.user_sign_in_get = asyncHandler(async (req, res, next) => {
  res.render("sign-in-form", { title: "Sign In" });
});

exports.user_sign_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

//LOG OUT

exports.user_log_out = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
