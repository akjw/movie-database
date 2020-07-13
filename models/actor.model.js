const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actorSchema = Schema({
    name: String,
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
    }]
});

const Actor = mongoose.model("Actor", actorSchema);

module.exports = Actor;