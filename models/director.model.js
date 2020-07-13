const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const directorSchema = Schema({
    name: String,
});

const Director = mongoose.model("Director", directorSchema);

module.exports = Director;