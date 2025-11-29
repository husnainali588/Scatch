const userModel = require("../models/user-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { generateToken } = require("../utils/generateToken")
const { hashedPassword } = require("../utils/bcryptPassword")

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
        req.flash("success","Your account is created, you can login.")
        res.status(201).redirect("/");

    } catch (err) {
        console.error("Critical Registration Error:", err.message);
        res.status(500).send({ message: "An unexpected error occurred. Please try again later." });
    }

}

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    req.flash("error","Email or Password is incorrect")

    let user = await userModel.findOne({ email })
    if (!user) return res.redirect("/")

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token)
            res.render("shop")
        }
        else return res.redirect("/")
    })

}
