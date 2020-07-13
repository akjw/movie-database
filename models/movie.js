const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const movieSchema = Schema ({
    title: String,
    description: String,
    genres: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Genre",
            },

    ],
    director: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Director",
            },
    actors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actor",
    }],
    imagePath:  String,
    featured: Boolean,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;