const express = require("express");
const res = require("express/lib/response");
const app = express()
const port = 3000;
var date = new Date();
var hour = date.getHours();
var min = date.getMinutes();
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]
app.listen(port, () => console.log(`server is running on http://127.0.0.1:${port}`))
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


app.get("/movies/read", (req, res) => {
    res.send(
        { status: 200, data: movies })
})
app.get("/movies/read/by-date", (req, res) => {
    res.send(
        { status: 200, data: movies.sort((a, b) => { return a.year - b.year }) })

})
app.get("/movies/read/by-rating", (req, res) => {
    res.send(
        { status: 200, data: movies.sort((a, b) => { return a.rating - b.rating }).reverse() })

})
app.get("/movies/read/by-title", (req, res) => {
    res.send(
        { status: 200, data: movies.sort((a, b) => { return a.title > b.title ? 1 : ((b.title > a.title) ? -1 : 0) }) })
})

app.get("/movies/read/id/:id", (req, res) => {
    if (req.params.id > movies.length || req.params.id > movies.length) {
        res.send({ status: 404, error: true, message: `the movie ${req.params.id} does not exist` })
        res.statusCode = 404;
        console.log(res.statusCode)
    }

    else {
        for (let i = 0; i < movies.length; i++) {
            if (req.params.id == i + 1) {
                res.send({ status: 200, data: movies[i] })
            }
        }
    }
})

app.get("/movies/create", (req, res) => { res.send('create') })
app.get("/movies/add", (req, res) => {
    let title = req.query.title;
    let year = req.query.year;
    let rating = req.query.rating;
    if (title != "" && year != "" && title != undefined && year != 0 && year != undefined && year.length == 4 && !isNaN(year)) {
        if (rating != "") {
            var obj = { "title": title, "year": year, "rating": rating }
        }
        else { var obj = { "title": title, "year": year, "rating": rating = 4 } }
        movies.push(obj)
        res.send(movies)
        console.log(movies)
    }
    else {
        res.statusCode = 403;
        res.send({ status: 403, error: true, message: `you cannot create a movie without providing a title and a year` })
    }
})


app.get("/movies/delete", (req, res) => { res.send('delete') })
app.get("/movies/delete/:id", (req, res) => {


    if (req.params.id > movies.length || req.params.id > movies.length) {
        res.send({ status: 404, error: true, message: `the movie ${req.params.id} does not exist` })
        res.statusCode = 404;
        console.log(res.statusCode)
    }

    else {
        for (let i = 0; i < movies.length; i++) {
            if (req.params.id == i + 1) {
                movies.splice(i, 1)
                res.send({ status: 200, data: movies })
            }
        }
    }
})



app.get("/movies/update", (req, res) => { res.send('update') })
app.get("/movies/update/:id", (req, res) => {
    let title = req.query.title;
    let year = req.query.year;
    let rating = req.query.rating;
    if (req.params.id <= movies.length || req.params.id > 0) {
    if (title != "" && year != "" && title != undefined && year != 0 && year != undefined && rating != undefined && year.length == 4 && !isNaN(year)) {
        var obj = { "title": title, "year": year, "rating": rating }
    }
    else if (title == undefined) {
        var obj = { "title": movies[req.params.id - 1].title, "year": year, "rating": rating }
        if (year == undefined) {
            var obj = { "title": movies[req.params.id - 1].title, "year": movies[req.params.id - 1].year, "rating": rating }
        }
        if (rating == undefined) {
            var obj = { "title": movies[req.params.id - 1].title, "year": year, "rating": movies[req.params.id - 1].rating }
        }
    }
    else if (year == undefined) {
        var obj = { "title": title, "year": movies[req.params.id - 1].year, "rating": rating }
        if (title == undefined) {
            var obj = { "title": movies[req.params.id - 1].title, "year": movies[req.params.id - 1].year, "rating": rating }
        }
        if (rating == undefined) {
            var obj = { "title": title, "year": movies[req.params.id - 1].year, "rating": movies[req.params.id - 1].rating }
        }
    }
    else if (rating == undefined) {
        var obj = { "title": title, "year": year, "rating": movies[req.params.id - 1].rating }
        if (title == undefined) {
            var obj = { "title": movies[req.params.id - 1].title, "year": year, "rating": movies[req.params.id - 1].rating }
        }
        if (year == undefined) {
            var obj = { "title": title, "year": movies[req.params.id - 1].year, "rating": movies[req.params.id - 1].rating }
        }
    }
    movies[req.params.id - 1] = obj
    res.send(movies)
    console.log(movies)
    }
    else {
        res.statusCode = 403;
        res.send({ status: 403, error: true, message: `the movie ${req.params.id} does not exist` })
    }
}
)