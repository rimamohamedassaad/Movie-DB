const express = require("express");
const authuser = (permission) =>{
    return (req,res,next) => {
const userRole = req.body.role;
if(permission.includes(userRole)) {

    next();
}
else {
    return res.status(401).send('you are not allowed')
}
    }
}

module.exports = {authuser};