const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/crypto_db");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error in connecting to db!"));

db.once("open", function(){
    console.log("Connection Successful!");
});