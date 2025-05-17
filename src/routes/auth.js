const express = require("express");
const { validSignUpData } = require("../../utils/validations");
const bcrypt = require("bcrypt");
const User = require("../Models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  //create new instance of user model
  try {
    //validation of data
    validSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send({
      status: 1,
      message: "posted Successfully",
      user,
    });
  } catch (err) {
    res.status(400).send("error saving the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(401).send("please login");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //create a JWT token
      const token = await user.getJWT();

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

    res.status(200).json({
        status: 1,
        message: "Login successful",
        token: token,
        user : user,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    // res.clearCookie("token",{httpOnly:true});
    // res.send("logged Out successfully");

    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("logged out successfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

module.exports = authRouter;
