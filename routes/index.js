const express = require("express")
const router = express.Router()
const isloggedin = require("../middlewares/isLoggedIn")

router.get("/", (req, res) => {
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("index", { error, success })
})

router.get("/shop", isloggedin, (req, res) => {
    let error = req.flash("error")
    res.render("shop", { error })
})

module.exports = router