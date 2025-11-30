const express = require("express")
const router = express.Router()
const isloggedin = require("../middlewares/isLoggedIn")
const productModel = require("../models/product-model")

router.get("/", (req, res) => {
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("index", { error, success })
})

router.get("/shop", isloggedin, async (req, res) => {

    let error = req.flash("error") 
    let products = await productModel.find()
    res.render("shop", { error, products })
})

module.exports = router