const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", userController.RenderSignUpForm);

router.post("/signup", wrapAsync(userController.SignUpUser));

router.get("/login", userController.RenderLoginForm);

router.post("/login", 
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.Login
);

router.get("/logout", userController.LogOut);

module.exports = router;
