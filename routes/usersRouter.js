const express = require("express")
const router = express.Router()
const userModel = require("../models/user-model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.get("/", (req, res) => {
    res.send("Hello from Users")
})

router.post("/register", async (req, res) => {

    let { email, password, fullname } = req.body

    try {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.send(err.message)
                else {
                    let user = await userModel.create({
                        email,
                        password: hashedPassword,
                        fullname,
                    })
                    res.status(201);

                    let token = jwt.sign({ email, id: user_id }, "secret")
                    res.send(token)
                }
            })
        })

    } catch (err) {
        console.log(err.message);
    }

})

module.exports = router