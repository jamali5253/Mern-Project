const mongoose = require("mongoose")
// -------------------------------------- dotenv Section 
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const DATABASE = process.env.DATABASE;
// --------------------------------------- Mongoose Database Connection 
mongoose.set("strictQuery", true);
mongoose.connect(DATABASE).then(() => console.log(`Database Connected Successfully`)).catch(() => console.log("Not Conncted"));