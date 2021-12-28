const express = require("express")
const app = express()
const port = 3000;
app.listen(port , ()=> console.log(`server is running on http://127.0.0.1:${port}`))
app.get("/",(req,res)=>{res.send('ok')})