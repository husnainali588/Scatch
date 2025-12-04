const express = require("express")
const router = express.Router()
const ownerModel = require("../models/owner-model")
const productModel = require("../models/product-model")
const userModel = require("../models/user-model")
const { loginOwner, ownerlogout } = require("../controllers/authController")

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        let owners = await ownerModel.find()
        if (owners.length > 0) {
            return res
                .status(500)
                .send("You don't have permission to create owner.")
        }

        let { fullname, email, password } = req.body

        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password
        })

        res.status(201).send(createdOwner)
    })
}

router.get("/admin", (req, res) => {
    let success = req.flash("success")
    let error = req.flash("error")
    res.render("admin-login", {success,error})
})

router.post("/login", loginOwner)

router.get("/admin/dashboard", (req, res) => {
    let success = req.flash("success")
    let error = req.flash("error")
    res.render("admin-dashboard", { success, error })
})

router.get("/admin/inventory", async (req, res) => {
    let success = req.flash("success");
    let products = await productModel.find(); 
    res.render("admin-inventory", { products, success });
});

router.get("/admin/costumers", async (req, res) => {
    let success = req.flash("success");
    let users = await userModel.find(); 
    res.render("admin-costumers", { users, success });
});

router.post("/admin/delete/:id", async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        req.flash("success", "User deleted successfully.");
        res.redirect("/owner/admin/costumers");
    } catch (err) {
        req.flash("error", "Error deleting product.");
        res.redirect("/owner/admin/costumers");
    }
});

router.get("/admin/logout", ownerlogout)

module.exports = router 