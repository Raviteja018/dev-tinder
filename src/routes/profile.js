const express = require('express');
const userAuth = require('../Middlewares/userAuth');
const { validateEditProfileData } = require('../../utils/validations');
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async(req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try{
        const loggedInUser = req.user;

        if(!validateEditProfileData(req)){
            throw new Error("user update is failed");
        }

         Object.keys(req.body).forEach(key => {loggedInUser[key] = req.body[key]});
         await loggedInUser.save();
        res.send(loggedInUser);
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})

profileRouter.post("/profile/password/forgot", async(req, res) => {
    try{
        
    }catch(err){

    }
})

module.exports = profileRouter;





















