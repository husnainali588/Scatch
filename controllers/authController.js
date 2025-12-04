const userModel = require("../models/user-model")
const ownerModel = require("../models/owner-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utils/generateToken")
const { hashedPassword } = require("../utils/bcryptPassword")

module.exports.loginOwner = async (req, res) => {
    try {
        let { email, password } = req.body;

        // 1. Find the owner
        let owner = await ownerModel.findOne({ email });

        // 🛑 Error Case 1: Owner not found
        if (!owner) {
            req.flash("error", "Email not found in admin database.");
            return res.redirect("/owner/admin"); // Make sure this matches your route
        }

        if (password===owner.password) {
            // 🟢 Success Case: Password Matches
            let token = generateToken(owner);

            // Set Cookie
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            // Set Success Message
            req.flash("success", "Welcome to the Dashboard.");

            // Redirect to Dashboard
            return res.redirect("/owner/admin/dashboard");
        } else {
            // 🛑 Error Case 2: Wrong Password
            req.flash("error", "Invalid Password.");
            return res.redirect("/owner/admin");
        }

    } catch (err) {
        // 🛑 Error Case 3: Server Error
        console.error(err);
        req.flash("error", "System error occurred.");
        return res.redirect("/owner/admin");
    }
};

module.exports.registerUser = async (req, res) => {

    try {
        let { email, password, fullname } = req.body

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            req.flash("error", "You already have account, please login")
            return res.redirect("/")
        }

        let hash = await hashedPassword(password)
        let user = await userModel.create({
            email,
            password: hash,
            fullname,
        })

        let token = generateToken(user)
        res.cookie("token", token)
        req.flash("success", "Your account is created, you can login.")
        res.status(201).redirect("/");

    } catch (err) {
        console.error("Critical Registration Error:", err.message);
        res.status(500).send({ message: "An unexpected error occurred. Please try again later." });
    }

}

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    req.flash("error", "Email or Password is incorrect")

    let user = await userModel.findOne({ email })
    if (!user) return res.redirect("/")

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token)
            res.redirect("/shop")
        }
        else return res.redirect("/")
    })
}

module.exports.logout = (req, res) => {

    res.cookie("token", "")

    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect("/");
    });
}

module.exports.ownerlogout = (req, res) => {

    res.cookie("token", "")

    req.session.destroy((err) => {
        if (err) console.log(err);
        res.redirect("/owner/admin");
    });
}
