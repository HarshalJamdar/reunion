const jwt = require("jsonwebtoken")
// const { isValidObjectId } = require("mongoose")
// const userModel = require("../models/userModel")


let authentication = function (req, res, next) {
    try {
        let token = req.header('Authorization','Bearer Token')
  
        if (!token) return res.status(400).send({ status: false, message: "Token is required" })
    
        let decodedToken = jwt.verify(token.split(" ")[1], "beFriends",(err, decoded) => {    
        if (!decoded) {
        return res.status(401).send({ status: false, message: "Invalid token", err: err.message })
        } else {
        req.email = decoded.userId
        next();
    }
    });
    } catch (err) {
        return res.status(500).send({ status: false,  message: err.message })
    }
}

//**********************************************************************//

module.exports = { authentication }

//**********************************************************************//