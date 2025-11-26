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
            return res.status(401).send({ message: "This email already existed" })
        }

        let hash = await hashedPassword(password)
        let user = await userModel.create({
            email,
            password: hash,
            fullname,
        })

        let token = generateToken(user)
        res.cookie("token", token)

        res.status(201).send("user created successfully");

    } catch (err) {
        console.error("Critical Registration Error:", err.message);
        res.status(500).send({ message: "An unexpected error occurred. Please try again later." });
    }

}

module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email })
    if (!user) return res.status(401).send({ message: "Email or Password incorrect!" })

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token)
            res.send("You can login")
        }
        else return res.status(401).send({ message: "Email or Password incorrect!" })
    })

}
