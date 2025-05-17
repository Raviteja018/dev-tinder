const express = require("express");
const connectDB = require("./Config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const cors = require("cors");

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

//to read json data we use this middleware - it converts json to js object
// it is available from express v.4.16.0
app.use(express.json());
app.use(cookieParser()); // to read the cookies we use cookiesParser method

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB().then(() => {
    console.log("Database connection is established");
    app.listen(5000, () => {
        console.log("server is running on port 5000");
      })
})
.catch((err) => {
    console.log("Database connection is failed to establish");
})




