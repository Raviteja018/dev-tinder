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
        const id = decoded._id;

        //find the user
        const user = await User.findOne({_id:id});
        if(!user){
            throw new Error("User not found");
        }

        req.user = user;
        next();

    }catch(err){
        res.status(400).send("Error at userAuth profile: "+err.message);
    }
}

module.exports =  userAuth 