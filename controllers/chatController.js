const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.chat_get = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({}, "title text user date")
    .populate("user")
    .sort({ date: 1 })
    .exec();

  res.render("chat", {
    user: res.locals.currentUser,
    messages: messages,
  });
});

exports.chat_post = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 3 })
    .withMessage("Title must be longer than 3 characters")
    .isLength({ max: 30 })
    .withMessage("Title must be shorter than 30 characters")
    .escape(),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 5 })
    .withMessage("Message can't be shorter than 3 characters")
    .isLength({ max: 300 })
    .withMessage("Message can't be longer than 300 characters")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const messages = await Message.find({}, "title text user date")
      .populate("user")
      .sort({ date: 1 })
      .exec();
    const user = await User.findById(req.body.user).exec();
    const errors = validationResult(req);

    if (user === null) {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    }

    const newMessage = new Message({
      user: user,
      title: req.body.title,
      text: req.body.text,
      date: Date.now(),
    });

    if (!errors.isEmpty()) {
      res.render("chat", {
        user: res.locals.currentUser,
        messages: messages,
        errors: errors.array(),
      });
      return;
    } else {
      await newMessage.save();
      res.redirect("/chat");
    }
  }),
];

exports.delete_message = asyncHandler(async (req, res, next) => {
  if (res.locals.currentUser.admin) {
    await Message.findByIdAndDelete(req.body.message).exec();
  }
  res.redirect("/chat");
});
