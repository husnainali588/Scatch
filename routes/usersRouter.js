const express = require("express")
const router = express.Router()
const userModel = require("../models/user-model")

router.get("/", (req, res) => {
    res.send("Hello from Users")
})

router.post("/register", async (req, res) => {
    try {
        let { email, password, fullname } = req.body

        let user = await userModel.create({
            email,
            password,
            fullname,
        })

        res.send(user);

    } catch (err) {
        console.log(err.message);
    }

})

module.exports = router