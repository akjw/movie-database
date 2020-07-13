const Actor = require('../models/actor.model');
const Movie = require('../models/movie');
const router = require('express').Router()

router.get('/', (req, res) => {
    Actor.find()
    .then(actors => {
        res.render("actors/index", {actors})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/show/:id', (req, res) => {
    Actor.findById(req.params.id)
    .populate('movies')
    .then((actor) => {
        res.render("actors/show", {actor});
    })
    .catch(err => {
        console.log(err);
    })
})

router.get('/create', (req, res) => {
    res.render("users/create");
})

router.post('/create', (req, res) => {
    let actor = new Actor(req.body)
    actor.save()
    .then(() => {
        res.redirect('/actors');
    })
    .catch(err => {
        console.log(err)
    })  
})

router.get("/edit/:id", (req, res) => {
    Actor.findById(req.params.id)
    .then(actor => {
        res.render("actors/edit", {actor})
    })
    .catch(err => {
        console.log(err)
    })
})
router.post("/edit/:id", (req, res) => {
    Actor.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
        //redirect to home
        res.redirect("/actors")
    })
    .catch(err => {
        console.log(err)
    })
})

router.delete("/delete/:id", (req, res) => {
    Actor.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect("/actors")
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router;