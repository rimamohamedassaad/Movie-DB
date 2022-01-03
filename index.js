const express = require("express");
const res = require("express/lib/response");
//const {authUser, authuser} = require('./midellware')
const bodyParser = require("body-parser");
const app = express();
//const port = 3000;
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.json());
const cors = require('cors');
const Joi = require("joi");


mongoose.connect(`mongodb+srv://rimaassaad:rimaassaad123@cluster0.eubn2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);
//mongoose.set('useCreateIndex',true);
var date = new Date();
var hour = date.getHours();
var min = date.getMinutes();
const movieSchema = new mongoose.Schema({
    movieslist: [{ title: String, year: Number, rating: Number }],
});
const moviesDB = mongoose.model("movies", movieSchema);

const movies = new moviesDB({
    movieslist: [
        { title: "Jaws", year: 1975, rating: 8 },
        { title: "Avatar", year: 2009, rating: 7.8 },
        { title: "Brazil", year: 1985, rating: 8 },
        { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
    ],
});
const userSchema = new mongoose.Schema({
    userslist: [{ username: String, password: String ,role : String}],
});
const usersDB = mongoose.model("users", userSchema);
const users = new usersDB({
    userslist: [
        { username: "rimaassaad", password: "rimaassaad123" ,role: "admin" },
        { username: "karim", password: "karim123" ,role: "users" },
        { username: "wael", password: "wael123" ,role:"users"}
    ],
});
//crud for users
app.get("/users/read", (req, res) => {
    console.log(users.userslist)
    res.send(
        { status: 200, data: users.userslist })
})
app.get("/users/read/by-users", (req, res) => {
    res.send(
        { status: 200, data: users.userslist.sort((a, b) => { return a.username > b.username ? 1 : ((b.username > a.username) ? -1 : 0) }) })
})

app.post("/user/add", (req, res) => {
    let username = req.query.username;
    let password = req.query.password;
let role = req.query.role;
    if (username != "" && password != "" && username != undefined && password != 0 && password != undefined && password.length >= 4) {

        var obj = { "username": username, "password": password ,"role" : role}
        users.userslist.push(obj)
        users.save()
        res.send(users.userslist)

        console.log(users.userslist)
    }
    else {
        res.statusCode = 403;
        res.send({ status: 403, error: true, message: `you cannot create a useer without providing a username and a password` })
    }
})
app.delete("/users/delete/:id",authuser(["rimaassaad"]),(req, res) => {


    if (req.params.id > users.userslist.length || req.params.id > users.userslist.length) {
        res.send({ status: 404, error: true, message: `the movie ${req.params.id} does not exist` })
        res.statusCode = 404;
        console.log(res.statusCode)
    }

    else {
        for (let i = 0; i < users.userslist.length; i++) {
            if (req.params.id == i + 1) {
                users.userslist.splice(i, 1)
                users.save()
                res.send({ status: 200, data: users.userslist })

            }
        }
    }
})
function authuser(permission){
    return (req,res,next) => {
const userRole = req.body.role;
if(permission.includes(userRole)) {
    next();}
else {
    return res.status(401).send('you are not allowed')
}
    }
}

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


app.get("/movies/read",(req, res) => {
    res.send(
        { status: 200, data: movies.movieslist })
})
app.get("/movies/read/by-date", (req, res) => {
    res.send(
        { status: 200, data: movies.movieslist.sort((a, b) => { return a.year - b.year }) })

})
app.get("/movies/read/by-rating", (req, res) => {
    res.send(
        { status: 200, data: movies.movieslist.sort((a, b) => { return a.rating - b.rating }).reverse() })

})
app.get("/movies/read/by-title", (req, res) => {
    res.send(
        { status: 200, data: movies.movieslist.sort((a, b) => { return a.title > b.title ? 1 : ((b.title > a.title) ? -1 : 0) }) })
})

app.get("/movies/read/id/:id", (req, res) => {
    if (req.params.id > movies.movieslist.length || req.params.id > movies.movieslist.length) {
        res.send({ status: 404, error: true, message: `the movie ${req.params.id} does not exist` })
        res.statusCode = 404;
        console.log(res.statusCode)
    }

    else {
        for (let i = 0; i < movies.movieslist.length; i++) {
            if (req.params.id == i + 1) {
                res.send({ status: 200, data: movies.movieslist[i] })
            }
        }
    }
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
        movies.movieslist.push(obj)
       
        movies.save()
        res.send(movies.movieslist)
        console.log(movies.movieslist)
    }
    else {
        res.statusCode = 403;
        res.send({ status: 403, error: true, message: `you cannot create a movie without providing a title and a year` })
    }
})


app.get("/movies/delete", (req, res) => { res.send('delete') })
app.delete("/movies/delete/:id",  authuser(["admin"]) ,(req, res) => {


    if (req.params.id > movies.movieslist.length || req.params.id > movies.movieslist.length) {
        res.send({ status: 404, error: true, message: `the movie ${req.params.id} does not exist` })
        res.statusCode = 404;
        console.log(res.statusCode)
    }

    else {

        for (let i = 0; i < movies.movieslist.length; i++) {
            if (req.params.id == i + 1) {
                movies.movieslist.splice(i, 1)
                movies.save()
                res.send({ status: 200, data: movies.movieslist })
                
            }
        }
    }
})



app.get("/movies/update", (req, res) => { res.send('update') })
app.patch("/movies/update/:id",  authuser(["admin"]) ,(req, res) => {
    let title = req.query.title;
    let year = req.query.year;
    let rating = req.query.rating;
    if (req.params.id <= movies.movieslist.length && req.params.id > 0) {
        if (title != "" && year != "" && title != undefined && year != 0 && year != undefined && rating != undefined && year.length == 4 && !isNaN(year)) {
            if (rating != "") {
                var obj = { "title": title, "year": year, "rating": rating }
            }
            else { var obj = { "title": title, "year": year, "rating": rating = 4 } }
        }
        else if (title == undefined) {
            var obj = { "title": movies.movieslist[req.params.id - 1].title, "year": year, "rating": rating }
            if (year == undefined) {
                var obj = { "title": movies.movieslist[req.params.id - 1].title, "year": movies.movieslist[req.params.id - 1].year, "rating": rating }
            }
            if (rating == undefined) {
                var obj = { "title": movies.movieslist[req.params.id - 1].title, "year": year, "rating": movies.movieslist[req.params.id - 1].rating }
            }
        }
        else if (year == undefined) {
            var obj = { "title": title, "year": movies.movieslist[req.params.id - 1].year, "rating": rating }
            if (title == undefined) {
                var obj = { "title": movies.movieslist[req.params.id - 1].title, "year": movies.movieslist[req.params.id - 1].year, "rating": rating }
            }
            if (rating == undefined) {
                var obj = { "title": title, "year": movies.movieslist[req.params.id - 1].year, "rating": movies.movieslist[req.params.id - 1].rating }
            }
        }
        else if (rating == undefined) {
            var obj = { "title": title, "year": year, "rating": movies.movieslist[req.params.id - 1].rating }
            if (title == undefined) {
                var obj = { "title": movies.movieslist[req.params.id - 1].title, "year": year, "rating": movies.movieslist[req.params.id - 1].rating }
            }
            if (year == undefined) {
                var obj = { "title": title, "year": movies.movieslist[req.params.id - 1].year, "rating": movies.movieslist[req.params.id - 1].rating }
            }
        }
        movies.movieslist[req.params.id - 1] = obj
        res.send(movies.movieslist)
        console.log(movies.movieslist)
        movies.save()
    }
    else {
        res.statusCode = 403;
        res.send({ status: 403, error: true, message: `the movie ${req.params.id} does not exist` })
    }
}
)


const port = process.env.port || 3000;
app.listen(port, () => console.log(`server is running on http://127.0.0.1:${port}`))
