const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NewSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLenght: 2
    },
    age: {
        type: Number,
        required: true,
        min: 15,
        max: 70
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    email: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Plz Enter Correct Email")
            }
        }
        
    },
    pass: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required : true
            }
        }
    ]
    
});
//--------------------------------------------
NewSchema.pre("save", async function (next) {
    console.log("BCRYPT CONNETED SUCCESSFULLY");

    if (this.isModified("pass")) {
        this.pass = await bcrypt.hash(this.pass, 12);
    }
    
    next();
});
// ------------------------------------------------------------
NewSchema.methods.generateAuthToken = async function () {
    try {
    const token = jwt.sign({ _id: this._id }, process.env.SEC);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
    } catch (error) {
        console.log(error);
    }
}


const Model1 = new mongoose.model("Collection-Data1", NewSchema);
module.exports = Model1;