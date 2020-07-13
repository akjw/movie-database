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
    .populate('filmography')
    .then((actor) => {
        console.log(actor)
        res.render("actors/show", {actor})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get('/create', (req, res) => {
    res.render("users/create")
})
router.post('/create', (req, res) => {
    console.log(req.body)
    // //note that sequence doesnt matter as long as keys & data types match schema
    // let actorData = {
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    //     phone: req.body.phone,
    //     dob: req.body.dob,
    //     address: {
    //         blockNumber: req.body.blockNumber,
    //         street: req.body.street,
    //         zipcode: req.body.zipcode,
    //     },
    //     hobbies: req.body.hobbies,
    //     travel: {
    //         location: req.body.location,
    //         visited: req.body.visited,
    //     },
    // };
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