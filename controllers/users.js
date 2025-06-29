const User = require("../models/user");

module.exports.RenderSignUpForm = (req, res) => {
    res.render("users/signup");
};

module.exports.SignUpUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        if (!username || !email || !password) {
            req.flash("error", "All fields are required");
            return res.redirect("/signup");
        }

        if (password.length < 6) {
            req.flash("error", "Password must be at least 6 characters long");
            return res.redirect("/signup");
        }

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust! Account successfully created.");
            res.redirect("/listings");

        })
    } catch (err) {
    if (err.name === 'UserExistsError') {
            req.flash("error", "A user with this username already exists");
        } else {
            req.flash("error", err.message || "Registration failed. Please try again.");
        }
        res.redirect("/signup");
    }
};

module.exports.RenderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectUrl = req.session.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.LogOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }

        req.flash("success", "You have been logged out successfully!");
        res.redirect("/listings");
    })
};