const express = require("express");
const userAuth = require("../Middlewares/userAuth");
const ConnectionRequestModel = require("../Models/connection");
const User = require("../Models/user");
const userRouter = express.Router()

const USER_SAFE_DATA = "firstName lastName age gender photoUrl skills";

//get all pending requests from loggedIn User
userRouter.get("/user/requests/received", userAuth, async(req, res) => {
    try{
        const loggedInUser =  req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }).populate("fromUserId", ["firstName"])

        res.json({message: "data fetched successfully ", data : connectionRequest})
    }catch(err){
        res.status(400).send("Error : "+ err.message);
    }
})

userRouter.get("/user/connections", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id, status:"accepted"}
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequest.map(field => {
            return field.fromUserId._id.toString() === loggedInUser._id.toString() ? field.toUserId : field.fromUserId;
        });

        res.json({user_connection_message: data})

    }catch(err){
        res.status(400).send("Error : "+err.message);
    }
})

userRouter.get("/feed", userAuth, async(req, res) => {
    try{
        //user should see all the user cards except 
        //1.his own card
        //2.his connections
        //3.ignored people
        //4.already sent the connection requests
        const loggedInUser = req.user;

        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit > 50 ? 50 : limit;
        const skip = (page-1)*limit

        //find all connection requests the user( sent + received ) 
        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                //if from/toUser logs into the account
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select("fromUserId toUserId")

        //filter unique users
        const hideUserFromFeed = new Set();
        connectionRequest.forEach(req => {
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        });

        //$nin - only works with arrays
        const users = await User.find({
            $and : [//Array.from creates new array from set or Map
                {_id:{$nin:Array.from(hideUserFromFeed)}}, //returns the users who are not connected with the logged-in User.
                {_id:{$ne:loggedInUser._id}} //does not show the loggedIn user
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.send(users);

    }catch(err){
        res.status(400).json({user_feed_message: err.message})
    }
})

module.exports = userRouter;



















