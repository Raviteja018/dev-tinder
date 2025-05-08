const express = require("express");
const connectDB = require("./Config/database");
const app = express();
const User = require("./Models/user");
const validSignUpData = require("../utils/validations");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../utils/constants");
const userAuth = require("./Middlewares/auth");


 //to read json data we use this middleware - it converts json to js object
// it is available from express v.4.16.0
app.use(express.json());
app.use(cookieParser()); // to read the cookies we use cookiesParser method

app.post("/signup", async(req, res) => {

    //create new instance of user model
    
    try{

        //validation of data
        validSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({ firstName, lastName, emailId, password:passwordHash })
        await user.save();
        res.send({ 
            status:1,
            message:"posted Successfully",
            user
        })
    }catch(err){
        res.status(400).send("error saving the user: "+ err.message)
    }
})

app.post("/login", async(req, res) => {
    const {emailId, password} = req.body;
    try{
        const user = await User.findOne({emailId:emailId})
        if(!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(isPasswordValid){
            //create a JWT token 
            const payload = {_id:user._id};
            const token = jwt.sign(payload, "DevTinder@1234!", {expiresIn: "1h"});
            console.log(token);  

            //Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() +24 * 60 * 60 * 1000)
            } );

            res.send("login successfull!!");

        }else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
})

app.get("/profile", userAuth, async(req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error: " + err.message)
    }
    
})

app.post("/sendConnectionRequest", userAuth, async(req, res) => {
    console.log("sending connection request");
    const user = req.user;
    res.send(user.firstName+ " sent the connection request");
});

connectDB().then(() => {
    console.log("Database connection is established");
    app.listen(4000, () => {
        console.log("server is running on port 4000");
      });
})
.catch((err) => {
    console.log("Database connection is failed to establish");
})




