const main = () =>{
    const express = require("express");
const connectDB = require("./Config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const cors = require("cors");
const path = require("path");

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

//to read json data we use this middleware - it converts json to js object
// it is available from express v.4.16.0
app.use(express.json());
app.use(cookieParser()); // to read the cookies we use cookiesParser method

app.use(express.static(path.join(__dirname, '../../client/dist')));
console.log(path.join(__dirname, '../../client/dist/index.html'))
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});



connectDB().then(() => {
    console.log("Database connection is established");
    app.listen(3000, () => {
        console.log("server is running on port 3000");
      })
})
.catch((err) => {
    console.log("Database connection is failed to establish");
})
}

module.exports=main



