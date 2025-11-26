const express = require("express")
const router = express.Router()
const userModel = require("../models/user-model")
const bcrypt = require("bcrypt")

router.get("/", (req, res) => {
    res.send("Hello from Users")
})

router.post("/register", async (req, res) => {
    try {
        let { email, password, fullname } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        let user = await userModel.create({
            email,
            password: hashedPassword,
            fullname,
        })

        res.status(201).send(user);

    } catch (err) {
        console.log(err.message);
    }

})

module.exports = router