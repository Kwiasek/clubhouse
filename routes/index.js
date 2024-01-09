const express = require("express");
const router = express.Router();

const user = require("../controllers/userController");
const chat = require("../controllers/chatController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home Page", user: res.locals.currentUser });
});

router.get("/sign-up", user.user_sign_up_get);
router.post("/sign-up", user.user_sign_up_post);

router.get("/sign-in", user.user_sign_in_get);
router.post("/sign-in", user.user_sign_in_post);

router.get("/log-out", user.user_log_out);

router.get("/chat", chat.chat_get);
router.post("/chat", chat.chat_post);

router.post("/delete-message", chat.delete_message);

module.exports = router;
