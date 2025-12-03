const express = require("express")
const router = express.Router()
const isloggedin = require("../middlewares/isLoggedIn")
const productModel = require("../models/product-model")
const userModel = require("../models/user-model")

router.get("/", (req, res) => {
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("index", { error, success })
})

router.get("/shop", isloggedin, async (req, res) => {

    let success = req.flash("success")
    let products = await productModel.find()
    res.render("shop", { success, products })
})

router.get("/cart", isloggedin, async (req, res) => {

    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");
    res.render("cart", { user })
})

router.get("/addtocart/:id", isloggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email })
    user.cart.push(req.params.id)
    await user.save()
    req.flash("success", "Product is added")
    res.redirect("/shop")
})


module.exports = router