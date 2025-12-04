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
    res.render("shop", {success, products, user: req.user })
})

router.get("/shop/filter", isloggedin, async (req, res) => {
    try {
        let query = {};
        let sortOption = {};
        
        let minPrice = req.query.min;
        let maxPrice = req.query.max;

        if (minPrice || maxPrice) {
            query.price = {};
            
            if (minPrice && minPrice.trim() !== '') {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice && maxPrice.trim() !== '') {
                query.price.$lte = Number(maxPrice);
            }
        }

        let sort = req.query.sort;
        
        if (sort === 'low-to-high') {
            sortOption.price = 1; r
        } else if (sort === 'high-to-low') {
            sortOption.price = -1; 
        }

        let products = await productModel.find(query).sort(sortOption);

        let success = req.flash("success");
        
        res.render("shop", { 
            success, 
            products, 
            user: req.user,
            filters: {
                min: minPrice || '',
                max: maxPrice || '',
                sort: sort || ''
            }
        });

    } catch (err) {
        console.error('Filter error:', err);
        req.flash("error", "Something went wrong while filtering products");
        res.redirect("/shop");
    }
});

router.get("/cart", isloggedin, async (req, res) => {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart.product");

    const validCart = user.cart.filter(item => item.product !== null);

    if (user.cart.length !== validCart.length) {
        user.cart = validCart;
        await user.save();
    }

    res.render("cart", { user });
});

router.get("/cart/clear", isloggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        
        user.cart = []; 
        await user.save();
        
        req.flash("success", "Cart cleared successfully.");
        res.redirect("/cart");
    } catch (err) {
        req.flash("error", "Error clearing cart.");
        res.redirect("/cart");
    }
});

router.get("/addtocart/:id", isloggedin, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        const itemIndex = user.cart.findIndex(item => item.product.toString() === req.params.id);

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += 1;
        } else {
            user.cart.push({ product: req.params.id, quantity: 1 });
        }

        await user.save();
        req.flash("success", "Added to cart");
        const previousPage = req.get('Referer') || '/shop';
        res.redirect(previousPage);

    } catch (err) {
        req.flash("error", "Error adding to cart");

        const previousPage = req.get('Referer') || '/shop';
        res.redirect(previousPage);
    }
});

router.get("/cart/remove/:id", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        const itemIndex = user.cart.findIndex(item => item.product._id.toString() === req.params.id);
        if (itemIndex > -1) {
            if (user.cart[itemIndex].quantity > 1) {
                user.cart[itemIndex].quantity -= 1;
            }
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