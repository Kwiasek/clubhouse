const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

// SIGN UP
exports.user_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up-form", {
    title: "Sign Up to Clubhouse",
  });
});

exports.user_sign_up_post = [
  body("fname")
    .trim()
    .notEmpty()
    .withMessage("First name can't be empty")
    .isLength({ min: 2 })
    .withMessage("First name must be longer than 2 characters")
    .escape(),
  body("lname")
    .trim()
    .notEmpty()
    .withMessage("Last name can't be empty")
    .isLength({ min: 2 })
    .withMessage("Last name must be longer than 2 characters")
    .escape(),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username can't be empty")
    .isLength({ min: 3 })
    .withMessage("Username must be longer than 3 characters")
    .custom(async function (username, { req }) {
      const existing_user = await User.findOne(
        { username: req.body.username },
        "username"
      ).exec();
      if (existing_user) {
        if (username == existing_user.username) {
          throw new Error(`User ${username} already exists`);
        }
      } else return true;
    })
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password can't be empty")
    .isLength({ min: 6 })
    .withMessage("Password must be longer than 6 characters")
    .escape(),
  body("password_c")
    .trim()
    .notEmpty()
    .withMessage("Password can't be empty")
    .custom(async function (password_c, { req }) {
      const password = req.body.password;
      if (password_c != password) {
        throw new Error("Passwords must be same");
      } else return true;
    })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      try {
        const user = new User({
          fname: req.body.fname,
          lname: req.body.lname,
          username: req.body.username,
          password: hashedPassword,
        });

        if (!errors.isEmpty()) {
          res.render("sign-up-form", {
            title: "Sign Up to Clubhouse",
            baduser: user,
            errors: errors.array(),
          });
          return;
        }

        const result = await user.save();
        res.redirect("/");
      } catch (err) {
        return next(err);
      }
    });
  }),
];

//SIGN IN

exports.user_sign_in_get = asyncHandler(async (req, res, next) => {
  res.render("sign-in-form", {
    title: "Sign In",
    user_not_found: req.session.messages,
  });
});

exports.user_sign_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/sign-in",
  failureMessage: "Can't find user with given credentials",
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
