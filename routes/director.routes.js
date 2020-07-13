const Director = require('../models/director.model');
const Movie = require('../models/movie');
const router = require('express').Router()

router.get('/', (req, res) => {
    Director.find()
    .then(directors => {
        res.render("directors/index", {directors})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/show/:id', (req, res) => {
    Director.findById(req.params.id)
    .populate('works')
    .then((director) => {
        res.render("directors/show", {director})
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/create', (req, res) => {
    let director = new Director(req.body)
    director.save()
    .then(() => {
        res.redirect('/directors');
    })
    .catch(err => {
        console.log(err)
    })  
})

router.get("/edit/:id", (req, res) => {
    Director.findById(req.params.id)
    .then(director => {
        res.render("directors/edit", {director})
    })
    .catch(err => {
        console.log(err)
    })
})
router.post("/edit/:id", (req, res) => {
    Director.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
        //redirect to home
        res.redirect("/directors")
    })
    .catch(err => {
        console.log(err)
    })
})

router.delete("/delete/:id", (req, res) => {
    Director.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect("/directors")
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router;