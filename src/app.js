const express = require("express");
const connectDB = require("./Config/database");
const app = express();
const User = require("./Models/user");
app.use(express.json())


app.post("/user", async(req, res) => {
    const user = new User({
        firstName: "Ravi",
        lastName: "Teja",
        emailId:"raviteja@gmail.com",
        password:"Raviteja@123",
        age:22,
        gender:"Male"
    })

    try{
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

connectDB().then(() => {
    console.log("Database connection is established");
    app.listen(4000, () => {
        console.log("server is running on port 4000");
      });
})
.catch((err) => {
    console.log("Database connection is failed to establish");
})




