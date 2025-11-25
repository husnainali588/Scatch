const mongoose = require('mongoose')
const config = require("config")

const dbgr = require("debug")("development:mongoose")

mongoose
.connect(`${config.get("MONGODB_URI")}/scatch`)
.then(() => {
    dbgr("connected");
})
.catch((err) => {
    dbgr(err.message);
})

module.exports = mongoose.connection;