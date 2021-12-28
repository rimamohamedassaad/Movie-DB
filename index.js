const express = require("express")
const app = express()
const port = 3000;
var date = new Date();
var hour = date.getHours();
var min = date.getMinutes();
app.listen(port, () => console.log(`server is running on http://127.0.0.1:${port}`))
app.get("/", (req, res) => { res.send('ok') })
app.get("/test", (req, res) => { return res.send(`{status:200, message:ok}`) })
app.get("/time", (req, res) => {
    return (
        res.send(`{status:200, message: ${hour} : ${min} }`))
})