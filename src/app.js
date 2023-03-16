const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const cookieparser = require("cookie-parser")
const path = require('path');
const fs = require("fs")
// ------------------------------------
const app = express();
dotenv.config({ path: "./config.env" });
const Port = 8000 || process.env.PORT
const path12 = path.join(__dirname, "/react/dist/index.html"); 

// --------------------------------
app.use(cors({
    origin: "http://127.0.0.1:5173", // replace with your frontend URL
    credentials: true
  }));
app.use(require("../Routers/auth2"));
app.use(cookieparser());
app.use(express.static(path.join(__dirname, "../react/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname , "../react/dist/index.html"))
})

// ---------------------------------
app.listen(Port, () => {
    console.log(`PORT ${Port} IS CONNECTED SUCCESSFULLY`);
})