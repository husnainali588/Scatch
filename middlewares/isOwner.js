const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");

module.exports = async (req, res, next) => {
    
    if (!req.cookies.token) {
        req.flash("error", "You need to login as an owner first.");
        return res.redirect("/owner/admin");
    }

    try {
    
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let owner = await ownerModel.findOne({ email: decoded.email }).select("-password");
        if (!owner) {
            req.flash("error", "You are not authorized to access this panel.");
            return res.redirect("/owner/admin");
        }

        req.owner = owner;
        next();

    } catch (err) {
        req.flash("error", "Invalid Token. Please login again.");
        res.redirect("/owner/admin");
    }
};