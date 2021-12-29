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

app.get("/movies/create", (req, res) => { res.send('create') })
app.get("/movies/read", (req, res) => {
    res.send(
        { status: 200, data: movies })
})
app.get("/movies/update", (req, res) => { res.send('update') })
app.get("/movies/delete", (req, res) => { res.send('delete') })