const express = require("express")
const router = express.Router()
const upload = require("../config/multer-config")
const productModel = require("../models/product-model")

router.post("/create", upload.single("image"), async (req, res) => {

    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        })

        req.flash("success","Product created successfully.")
        res.redirect("/owner/admin/dashboard")
    } catch (err) {
        res.send(err.message)
    }
})

router.post("/delete/:id", async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        req.flash("success", "Product deleted successfully.");
        res.redirect("/owner/admin/inventory");
    } catch (err) {
        req.flash("error", "Error deleting product.");
        res.redirect("/owner/admin/dashboard");
    }
});

module.exports = router