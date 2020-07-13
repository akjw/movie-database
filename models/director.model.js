const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const directorSchema = Schema({
    name: String,
    works: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
    }]
});

const Director = mongoose.model("Director", directorSchema);

module.exports = Director;