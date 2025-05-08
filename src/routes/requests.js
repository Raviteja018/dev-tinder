const express = require("express");
const userAuth = require("../Middlewares/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async(req, res) => {
    console.log("sending connection request");
    const user = req.user;
    res.send(user.firstName+ " sent the connection request");
});

module.exports = requestRouter;













