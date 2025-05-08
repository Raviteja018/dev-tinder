const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const userAuth = async(req, res, next) => {
    try{
        //read the token from the req cookies
        const token = req.cookies.token;

        if(!token){
            throw new Error("No token found");
        }

        //validate token 
        const decoded = jwt.verify(token, "DevTinder@1234!");
        const {_id} = decoded;

        //find the user
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }

        req.user = user;
        next();


    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
}

module.exports =  userAuth 