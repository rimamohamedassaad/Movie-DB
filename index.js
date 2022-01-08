const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.json());
require('dotenv').config()
//connection
const { MongoClient, ObjectId } = require('mongodb');
const Joi = require("joi");
const uri = process.env.DBCONNECTION;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});
mongoose.connect(uri, { useNewUrlParser: true }, err => {
    if (err) throw err;
    console.log("connected successfully")
});
//movies schema 
const movieSchema = new mongoose.Schema(
    [{ title: String, year: Number, rating: Number }]
);
//movies DB
const MoviesDB = mongoose.model("MoviesDB", movieSchema);
MoviesDB.create([
    { title: "Jaws", year: 1975, rating: 8 },
    { title: "Avatar", year: 2009, rating: 7.8 },
    { title: "Brazil", year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }]
)
    .then()
    .catch(err => res.status(422).send(err));

//USERS
const users = {
    userslist: [
        { username: "rimaassaad", password: "rimaassaad123", role: "admin" },
        { username: "karim", password: "karim123", role: "users" },
        { username: "wael", password: "wael123", role: "users" }
    ],
};
//crud for users
app.get("/users/read", (req, res) => {

    res.send(
        { status: 200, data: users.userslist })
})
app.get("/users/read/by-users", (req, res) => {
    res.send(
        { status: 200, data: users.userslist.sort((a, b) => { return a.username > b.username ? 1 : ((b.username > a.username) ? -1 : 0) }) })
})

app.post("/user/add", async (req, res) => {
    
    let username = req.query.username;
    let password = req.query.password;
    let role = req.query.role;
    if (username != "" && password != "" && username != undefined && password != 0 && password != undefined && password.length >= 4) {

        var obj = { "username": username, "password": password, "role": role }
        users.userslist.push(obj)
        res.send(users.userslist)
        console.log(users.userslist)
    }
    else {
        res.statusCode = 403;
        res.send({ status: 403, error: true, message: `you cannot create a useer without providing a username and a password` })
    }
})
app.delete("/users/delete/:id", (req, res) => {

    if (req.params.id > users.userslist.length || req.params.id > users.userslist.length) {
        res.send({ status: 404, error: true, message: `the movie ${req.params.id} does not exist` })
        res.statusCode = 404;
        console.log(res.statusCode)
    }

    else {
        for (let i = 0; i < users.userslist.length; i++) {
            if (req.params.id == i + 1) {
                users.userslist.splice(i, 1)
                res.send({ status: 200, data: users.userslist })

            }
        }
    }
})
app.patch("/users/update/:id" , (req,res) =>{
    let username = req.query.username;
    let password = req.query.password;
    let role = req.query.role;
    if (req.params.id <= users.userslist.length || req.params.id > 0) {
    if (username != "" && password != "" && username != undefined && password != 0 && password != undefined && role != undefined) {
        var obj = { "username": username, "password": password, "role": role }
    }
    else if (username == undefined) {
        var obj = { "username": users.userslist[req.params.id - 1].username, "password": password, "role": role }
        if (year == undefined) {
            var obj = { "title": users.userslist[req.params.id - 1].username, "password": users.userslist[req.params.id - 1].password, "role": role }
        }
        if (rating == undefined) {
            var obj = { "username": users.userslist[req.params.id - 1].username, "password": password, "role": users.userslist[req.params.id - 1].role }
        }
    }
    else if (password == undefined) {
        var obj = { "username": username, "password": users.userslist[req.params.id - 1].password, "role": role }
        if (username == undefined) {
            var obj = { "username": users.userslist[req.params.id - 1].username, "password": users.userslist[req.params.id - 1].password, "role": role }
        }
        if (role == undefined) {
            var obj = { "username": username, "password": users.userslist[req.params.id - 1].password, "role": users.userslist[req.params.id - 1].role }
        }
    }
    else if (role == undefined) {
        var obj = { "username": username, "password": password, "role": users.userslist[req.params.id - 1].role }
        if (title == undefined) {
            var obj = { "username": users.userslist[req.params.id - 1].username, "password": password, "role": users.userslist[req.params.id - 1].role }
        }
        if (password == undefined) {
            var obj = { "username": username, "password": users.userslist[req.params.id - 1].password, "role": users.userslist[req.params.id - 1].role }
        }
    }
    users.userslist[req.params.id - 1] = obj
    res.send({ status: 200,data : users})
    console.log(users.userslist)
    }
    else {
        res.statusCode = 403;
        res.send({ status: 403, error: true, message: `the movie ${req.params.id} does not exist` })
    }

})

//authenticated user admin 
function authuser(permission) {
    return (req, res, next) => {
        const username = req.body.username;
        const userRole = req.body.role;
        const password = req.body.password;

        if (permission.includes(userRole)) {
            next();
        }
        else {
            return res.status(401).send('you are not allowed')
        }
    }
}
//movies 
var date = new Date();
var hour = date.getHours();
var min = date.getMinutes();
app.get("/", (req, res) => { res.send(`ok`) })
app.get("/test", (req, res) => { return res.send({ status: 200, message: `ok` }) })
app.get("/time", (req, res) => {
    return (
        res.send({ status: 200, message: ` ${hour} : ${min}` }))
})
app.get(`/hello/(:id)?`, (req, res) => {
    if (req.params.id != undefined)
        res.send({ status: 200, message: `Hello, ${req.params.id}` })
    else {
        res.send({ status: 200, message: `Hello unknown` })
    }
});
app.get('/search', (req, res) => {
    let search = req.query.s
    if (search != "") {
        console.log(search)
        res.send({ status: 200, message: `Hello, ${search}` })
        console.log(res.statusCode)
    }
    else {
        res.statusCode = 500
        console.log(res.statusCode)
        res.send({ status: 500, error: true, message: `you have to provide a search` })
    }

})

//CRUD FOR MOVIES
app.get("/movies/read", (req, res) => {
    
    MoviesDB.find().then(data => {
        res.status(200).send(data)
        console.log(data)
    }).catch(err => {
        res.status(404).json({ message: err })
    });
})
app.get("/movies/read/by-date", (req, res) => {
    MoviesDB.find()
        .then(movies => {
            res.status(200).send({ status: 200, data: movies.sort((a, b) => b.year - a.year) })
        })
        .catch(err => {
            res.status(422).send(err);
        })
})
app.get("/movies/read/by-rating", (req, res) => {
    MoviesDB.find()
        .then(movies => {
            res.status(200).send({ status: 200, data: movies.sort((a, b) => b.rating - a.rating) })
        })
        .catch(err => {
            res.status(422).send(err);
        })
})
app.get("/movies/read/by-title", (req, res) => {
    MoviesDB.find()
        .then(movies => {
            res.status(200).send(
                { status: 200, data: movies.sort((a, b) => { return a.title > b.title ? 1 : ((b.title > a.title) ? -1 : 0) }) })

        })
        .catch(err => {
            res.status(422).send(err);
        })
})

app.get("/movies/read/id/:id", (req, res) => {

    let id = req.params.id
    MoviesDB.findById(id).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        res.status(404).json({ message: err })
    });
})

app.get("/movies/create", (req, res) => { res.send('create') })
app.post("/movies/add", (req, res) => {
    let title = req.body.title;
    let year = req.body.year;
    let rating = req.body.rating;
    if (title != "" && year != "" && title != undefined && year != 0 && year != undefined && year.length == 4 && !isNaN(year)) {
        if (rating != "") {
            var obj = { "title": title, "year": year, "rating": rating }
        }
        else { var obj = { "title": title, "year": year, "rating": rating = 4 } }
        MoviesDB.create(obj)
        res.json(MoviesDB)
    } else {
        res.statusCode = 403;
        res.send({ status: 403, error: true, message: `you cannot create a movie without providing a title and a year` })
    }
})


app.get("/movies/delete", authuser(["admin"]), (req, res) => { res.send('delete') })
app.delete("/movies/delete/:id", authuser(["admin"]), (req, res) => {
    MoviesDB.findOneAndDelete({ _id: req.params.id })
        .then(deletedMovie => {
            if (!deletedMovie) return res.status(404).send({ status: 404, error: true, message: `The movie ${req.params.id} does not exist` });
            MoviesDB.find()
                .then(movies => {
                    res.status(200).send({ status: 200, data: movies })
                })
                .catch(err => {
                    res.status(422).send(err);
                })
        })
        .catch(err => {
            res.status(422).send(err);
        })
})
app.get("/movies/update", authuser(["admin"]),(req, res) => { res.send('update') })
app.patch('/movies/update/:id', authuser(["admin"]),(req, res) => {
    let title = req.query.title 
    let year = req.query.year
    let rating = req.query.rating
    let id = req.params.id;
    MoviesDB.findById(id).then((obj) => {
        
        if (title && title !== undefined) {
            obj.title = title
        }
        if (year && !isNaN(year) && year.length === 4) {
            obj.year = req.query.year
        }
        if (rating && !isNaN(rating)) {
            obj.rating = rating
        }
        obj.save()
        MoviesDB.find().then(data => {
            res.json({ status: 200, data: data });
        }).catch(err => {
            console.log("error")
        })
    }).catch(err => {
        res.status(404).json({ status: 404, error: true, message: `the movie ${req.params.id} does not exist` })
    })
})




const port = process.env.port || 3000;
app.listen(port, () => console.log(`server is running on http://127.0.0.1:${port}`))
