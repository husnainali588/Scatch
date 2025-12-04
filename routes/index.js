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
    res.render("shop", { success, products, user: req.user })
})

router.get("/cart", isloggedin, async (req, res) => {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart.product");

    // 🧹 AUTO-CLEAN: Filter out items where product is null (deleted products)
    const validCart = user.cart.filter(item => item.product !== null);
    
    // If we found bad items, update the database immediately
    if (user.cart.length !== validCart.length) {
        user.cart = validCart;
        await user.save();
    }

    res.render("cart", { user });
});

router.get("/addtocart/:id", isloggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        // 1. Check if product is already in cart
        // We compare IDs as strings to be safe
        const itemIndex = user.cart.findIndex(item => item.product.toString() === req.params.id);
        if (itemIndex > -1) {
            // 2. PRODUCT EXISTS: Increment Quantity
            user.cart[itemIndex].quantity += 1;
        } else {
            // 3. NEW PRODUCT: Push object with ID and default quantity
            user.cart.push({ product: req.params.id, quantity: 1 });
        }
        await user.save();
        req.flash("success", "Added to cart");
        res.redirect("/shop");
    } catch (err) {
        req.flash("error", "Error adding to cart");
        res.redirect("/shop");
    }
})

router.get("/cart/remove/:id", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        const itemIndex = user.cart.findIndex(item => item.product._id.toString() === req.params.id);
        if (itemIndex > -1) {
            // 1. If quantity is greater than 1, just decrease it
            if (user.cart[itemIndex].quantity > 1) {
                user.cart[itemIndex].quantity -= 1;
            }
            // 2. If quantity is 1, remove the item entirely
            else {
                user.cart.splice(itemIndex, 1);
            }
            await user.save();
            req.flash("success", "Cart updated");
        }
        res.redirect("/cart");
    } catch (err) {
        req.flash("error", "Error updating cart");
        res.redirect("/cart");
    }
})

module.exports = router