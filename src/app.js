const main = () =>{
const express = require("express");
const connectDB = require("./Config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

// Import your routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

const app = express();

// Enable CORS for your frontend domain
app.use(cors({
  origin: "https://devtinderravi.netlify.app/",
  credentials: true,
}));


// Parse incoming JSON
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Mount your API routes under /api
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

// Connect to database and start server
connectDB()
  .then(() => {
    console.log("Database connection is established");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed to establish:", err);
  });
}

module.exports=main



