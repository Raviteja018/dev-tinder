const express = require("express");
const userAuth = require("../Middlewares/userAuth");
const ConnectionRequestModel = require("../Models/connection");
const User = require("../Models/user");

const requestRouter = express.Router();

requestRouter.post("/request/:status/:toUserId", userAuth, async(req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        })

        const allowedStatus = ["ignored","interested"];

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message:"toUser not found"})
        }

        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid request status: "+status);
        }

        //If there is an exisiting Connection Request
        const exisitingConnectionRequest = await ConnectionRequestModel.findOne({
            $or:[
                {fromUserId, toUserId}, // eg : A -> B
                {fromUserId:toUserId, toUserId:fromUserId}   //eg : B -> A
            ]
        })

        if(exisitingConnectionRequest){
            return res.status(400).json({
                message: "Request Connection already exists"
            })
        }

        const data = await connectionRequest.save();

        res.json({message:"connection request is successful ", Data: data})
    }catch(err){
        res.status(400).json("Error: "+err.message)
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message: "Invalid status type"})
        }

        //Ravi ---> Virat Kohli
        //request Id should be valid
        //LoggedIn user must be Virat Kohli (loggedIn Id == toUserId)
        //status must be interested
        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId : loggedInUser._id,
            status: "interested",
        })

        if(!connectionRequest){
            return res.status(404).json({message: "connection request not found"});
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({
            message:"connection request " + status, data
        })

    }catch(err){
        res.status(400).send("Error : " + err.message);
    }
})

module.exports = requestRouter;













