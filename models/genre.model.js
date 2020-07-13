const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const genreSchema = Schema({
    name: String,
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
    }]
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports = Genre;