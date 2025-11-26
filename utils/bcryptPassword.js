const bcrypt = require("bcrypt")

const hashedPassword = async (password) => {
    try {
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt)
        return hash 

    } catch (err) {
        console.log("Bcryption failed:", err.message);
        throw err;
    }
}

module.exports = {hashedPassword}