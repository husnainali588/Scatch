const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");

module.exports = async (req, res, next) => {
    // 1. Check if token exists
    if (!req.cookies.token) {
        req.flash("error", "You need to login as an owner first.");
        return res.redirect("/owner/admin");
    }

    try {
        // 2. Verify Token
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        
        // 3. Check if this person exists in the OWNER database
        // (Regular users won't be found here, so they get blocked)
        let owner = await ownerModel.findOne({ email: decoded.email }).select("-password");

        if (!owner) {
            req.flash("error", "You are not authorized to access this panel.");
            return res.redirect("/owner/admin");
        }

        // 4. Success: Attach owner to request and proceed
        req.owner = owner;
        next();

    } catch (err) {
        req.flash("error", "Invalid Token. Please login again.");
        res.redirect("/owner/admin");
    }
};