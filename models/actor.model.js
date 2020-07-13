const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actorSchema = Schema({
    name: String,
});

const Actor = mongoose.model("Actor", actorSchema);

module.exports = Actor;