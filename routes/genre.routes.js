const Genre = require('../models/genre.model');
const Movie = require('../models/movie');
const router = require('express').Router();

router.get('/', (req, res) => {
    Genre.find()
    .then(genres => {
        res.render("genres/index", {genres});
    })
    .catch(err => {
        console.log(err);
    })
})

router.get('/show/:id', (req, res) => {
    Genre.findById(req.params.id)
    .populate('movies')
    .then((genre) => {
        res.render("genres/show", {genre});
    })
    .catch(err => {
        console.log(err);
    })
})

router.post('/create', (req, res) => {
    let genre = new Genre(req.body)
    genre.save()
    .then(() => {
        res.redirect('/genres');
    })
    .catch(err => {
        console.log(err);
    })  
})

router.get("/edit/:id", (req, res) => {
    Genre.findById(req.params.id)
    .then(genre => {
        res.render("genres/edit", {genre});
    })
    .catch(err => {
        console.log(err);
    })
})
router.post("/edit/:id", (req, res) => {
    Genre.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
        //redirect to home
        res.redirect("/genres");
    })
    .catch(err => {
        console.log(err);
    })
})

router.delete("/delete/:id", (req, res) => {
    Genre.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect("/genres");
    })
    .catch(err => {
        console.log(err);
    })
})

module.exports = router;