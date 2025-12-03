const express = require("express")
const router = express.Router()
const isloggedin = require("../middlewares/isLoggedIn")
const productModel = require("../models/product-model")
const userModel = require("../models/user-model")
const isLoggedIn = require("../middlewares/isLoggedIn")

router.get("/", (req, res) => {
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("index", { error, success })
})

router.get("/shop", isloggedin, async (req, res) => {

    let success = req.flash("success")
    let products = await productModel.find()
    let user = await userModel.find()
    res.render("shop", { success, products, user: req.user})
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

router.get("/cart/remove/:id", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel
            .findOneAndUpdate({ email: req.user.email }, { $pull: { cart: req.params.id } })
        req.flash("success", "Item removed")
        res.redirect("/cart")
    } catch (error) {
        req.flash("error", "Something went wrong, try again")
        res.redirect("/cart")
    }
})

module.exports = router