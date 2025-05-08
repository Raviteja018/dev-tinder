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
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");


 //to read json data we use this middleware - it converts json to js object
// it is available from express v.4.16.0
app.use(express.json());
app.use(cookieParser()); // to read the cookies we use cookiesParser method

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB().then(() => {
    console.log("Database connection is established");
    app.listen(4000, () => {
        console.log("server is running on port 4000");
      })
})
.catch((err) => {
    console.log("Database connection is failed to establish");
})




