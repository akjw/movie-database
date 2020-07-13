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
    .populate('genres')
    .populate('director')
    .populate('actors')
    .then(movies => {
        res.render("movies/index", {movies})
    })
    .catch(err => {
        console.log(err)
    })
})

app.get("/show/:id", async (req, res)=>{
    try {
    let movie = await Movie.findById(req.params.id)
    .populate('actors')
    .populate('director')
    .populate('genres')
    console.log(movie)
    let actors = await Actor.find()
    let directors = await Director.find()
    let genres = await Genre.find()
    res.render("movies/show", {movie, actors, directors, genres})
    } catch (error) {
        console.log(error)
    }
})

app.get("/create", async (req, res) => {
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
    let movie = new Movie(req.body);
    movie.save()
      .then(() => {
        return Director.findByIdAndUpdate(movie.director, {$push: {movies: movie._id}}).exec();
      })
      .then(() => {
        let movieActors = movie.actors.map(actor => {
          Actor.findByIdAndUpdate(actor, {$push: {movies: movie._id}}).exec();
        });
        return Promise.all(movieActors);
      })
      .then(() => {
        let movieGenres = movie.genres.map(genre => {
          Genre.findByIdAndUpdate(genre, {$push: {movies: movie._id}}).exec();
        });
        return Promise.all(movieGenres);
      })
      .then(() => {
        res.redirect('/');
      })
      .catch(err => console.log(err));
  });

/*
Alternate Method
  app.post("/create", (req, res) => {
    let movie = new Movie(req.body);
    movie
      .save()
      .then(() => {
        let movieActors = movie.actors.map(actor => {
          Actor.findById(actor)
            .then(actor => {
              actor.filmography.push(movie._id);
              return actor.save();
            });
        });
        return Promise.all(movieActors);
      })
      .then(() => {
        return Director.findById(movie.director);
      })
      .then(director => {
        director.works.push(movie._id);
        return director.save();
      })
      .then(() => {
        res.redirect('/');
      })
      .catch(err => console.log(err));
  });
*/

// app.post("/create", (req, res) => {
//     let movie = new Movie(req.body)
//     movie
//     .save()
//     .then(()=>{
//         Director.findById(movie.director).then(director => {
//             director.works.push(movie._id);
//             director.save().then(() => {
//                 res.redirect("/")
//             })
//         })
//     })
//     .catch(err => {
//         console.log(err)
//     })
// })

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