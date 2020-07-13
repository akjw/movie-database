const express = require('express')
const app = express ()
const mongoose = require('mongoose')
const Movie = require('./models/movie')
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const Actor = require('./models/actor.model')
const Director = require('./models/director.model')
const Genre = require('./models/genre.model')
require('dotenv').config();

mongoose.connect(
    process.env.MONGODB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log("Mongodb connected")
    }
);

app.listen(process.env.PORT, ()=> {
    console.log("running!")
})

//Middleware
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use("/actors", require("./routes/actor.routes"));
app.use("/directors", require("./routes/director.routes"))
app.use("/genres", require("./routes/genre.routes"))

app.get("/", (req, res) => {
    Movie.find()
    .then(movies => {
        res.render("movies/index", {movies})
    })
    .catch(err => {
        console.log(err)
    })
})

app.get("/show/:id", async (req, res)=>{
    // Movie.findById(req.params.id)
    // .then(movie => {
    //     Actor.find()
    //     .then(actors => {
    //         Director.find()
    //         .then(directPersons => {
    //             Genre.find()
    //             .then(genreAdds => {
    //                 res.render("movies/show", {movie, actors, directPersons, genreAdds})
    //             })
    //         })
    //     })
    // })
    // .catch(err => {
    //     console.log(err)
    // })
    try {
    let movie = await Movie.findById(req.params.id)
    let actors = await Actor.find()
    let directors = await Director.find()
    let genres = await Genre.find()
    res.render("movies/show", {movie, actors, directors, genres})
    } catch (error) {
        console.log(error)
    }
})

app.get("/create", async (req, res) => {
    // Genre.find()
    // .then(genreAdds => {
    //     Director.find()
    //     .then(directPersons => {
    //         res.render('movies/create', { genreAdds, directPersons})
    //     })
    // })
    try{
        let genres = await Genre.find()
        let directors = await Director.find()
        let actors = await Actor.find()
        res.render('movies/create', {genres, directors, actors})
    } catch(err){
        console.log(err)
    }
})
app.post("/create", (req, res) => {
    let movie = new Movie(req.body)
    movie
    .save()
    .then(()=>{
        res.redirect("/")
    })
    .catch(err => {
        console.log(err)
    })
})

/* add actors just by name
app.get("/add/:movieid/actor/:actorid", (req, res) => {
    let actor = Actor.findById(req.params.actorid)
    Movie.findByIdAndUpdate(req.params.movieid, { $push: { actors : actor}})
    .then((movie) => {
        console.log(movie)
        res.redirect(`/show/${movie._id}`)})
    .catch(err => console.log(err))
})

app.get("/remove/:movieid/actor/:actorid", (req, res) => {
    let actor = Actor.findById(req.params.actorid)
    Movie.findByIdAndUpdate(req.params.movieid, { $pull: { actors : actor}})
    .then((movie) => res.redirect(`/show/${movie._id}`))
    .catch(err => console.log(err))
})
*/
  

app.get("/add/:movieid/actor/:actorname/:actorid", (req, res) => {
    // let actor = Actor.findById(req.params.actorid)
    let movie = Movie.findById(req.params.movieid)
    movie.then(movie => {
        console.log(movie.actors)
        //using .some always returns false-->why?
       let containsId = movie.actors.find(actor => actor._id == req.params.actorid)
       console.log(containsId)
       if(!containsId)
       {
        Movie.findByIdAndUpdate(req.params.movieid, { $push: { actors : {name: req.params.actorname, _id: req.params.actorid }}})
        .then((movie) => {
            // console.log(movie)
            res.redirect(`/show/${movie._id}`)})
        .catch(err => console.log(err))
       }
       else {
           res.send("Already exists!")
       }
    })
   // Just add w/o checking for duplicates
    // Movie.findByIdAndUpdate(req.params.movieid, { $push: { actors : {name: req.params.actorname, _id: req.params.actorid }}})
    // .then((movie) => {
    //     // console.log(movie)
    //     res.redirect(`/show/${movie._id}`)})
    // .catch(err => console.log(err))
 
})


app.get("/remove/:movieid/actor/:actorname/:actorid", (req, res) => {
    // let actor = Actor.findById(req.params.actorid)
    Movie.findByIdAndUpdate(req.params.movieid, { $pull: { actors : {name: req.params.actorname, _id: req.params.actorid }}})
    .then((movie) => res.redirect(`/show/${movie._id}`))
    .catch(err => console.log(err))
})

// app.get("/add/:movieid/actor/:actorname", (req, res) => {
//     // let actor = Actor.findById(req.params.actorid)
//     Movie.findByIdAndUpdate(req.params.movieid, { $push: { actors : req.params.actorname}})
//     .then((movie) => {
//         console.log(movie)
//         res.redirect(`/show/${movie._id}`)})
//     .catch(err => console.log(err))
// })

// app.get("/remove/:movieid/actor/:actorname", (req, res) => {
//     // let actor = Actor.findById(req.params.actorid)
//     Movie.findByIdAndUpdate(req.params.movieid, { $pull: { actors : req.params.actorname}})
//     .then((movie) => res.redirect(`/show/${movie._id}`))
//     .catch(err => console.log(err))
// })

app.get("/add/:movieid/director/:directorname", (req, res) => {
    // let actor = Actor.findById(req.params.actorid)
    Movie.findByIdAndUpdate(req.params.movieid, { $push: { directPerson : req.params.directorname}})
    .then((movie) => {
        console.log(movie)
        res.redirect(`/show/${movie._id}`)})
    .catch(err => console.log(err))
})

app.get("/remove/:movieid/director/:directorname", (req, res) => {
    // let actor = Actor.findById(req.params.actorid)
    Movie.findByIdAndUpdate(req.params.movieid, { $pull: { directPerson : req.params.directorname}})
    .then((movie) => res.redirect(`/show/${movie._id}`))
    .catch(err => console.log(err))
})

app.get("/add/:movieid/genre/:genrename", (req, res) => {
    // let actor = Actor.findById(req.params.actorid)
    Movie.findByIdAndUpdate(req.params.movieid, { $push: { genreAdds : req.params.genrename}})
    .then((movie) => {
        console.log(movie)
        res.redirect(`/show/${movie._id}`)})
    .catch(err => console.log(err))
})

app.get("/remove/:movieid/genre/:genrename", (req, res) => {
    // let actor = Actor.findById(req.params.actorid)
    Movie.findByIdAndUpdate(req.params.movieid, { $pull: { genreAdds : req.params.genrename}})
    .then((movie) => res.redirect(`/show/${movie._id}`))
    .catch(err => console.log(err))
})


app.get("/edit/:id", async (req, res) => {
    try {
        let movie = await Movie.findById(req.params.id)
        .populate('actors')
        .populate('director')
        .populate('genres')
        console.log(movie)
        let genres = await Genre.find()
        let actors = await Actor.find()
        let directors = await Director.find()
        res.render("movies/edit", { movie, genres, actors, directors })
    }
    catch (err){
        console.log(err)
    }
})
// app.get("/edit/:id", (req, res) => {
//     Movie.findById(req.params.id)
//     .then(movie => {
//         res.render("movies/edit", movie)
//     })
//     .catch(err => {
//         console.log(err)
//     })
// })

app.post("/edit/:id", (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
        res.redirect("/")
    })
    .catch(err => {
        console.log(err)
    })
})

app.delete("/delete/:id", (req, res) => {
    Movie.findByIdAndDelete(req.params.id)
    .then(() => {
        res.redirect("/")
    })
    .catch(err => {
        console.log(err)
    })
})