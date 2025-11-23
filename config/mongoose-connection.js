const mongoose = require('mongoose')

mongoose
.connect("mongodb://127.0.0.1:27101/scatch")
.then(() => {
    console.log("connected");
})
.catch((err) => {
    console.log(err.message);
})

module.exports = mongoose.connection;