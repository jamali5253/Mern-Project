const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("../Database_Connection/dbconnection1");
const Cookieparser = require("cookie-parser");
const authenticate = require("../Middleware/authanticate");
const authenticatehome = require("../Middleware/authenticatehome");
// -------------------------------
const router = express.Router();
const Model1 = require("../Database_Collections/Col1");
// --------------------------------------
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(Cookieparser());
// ----------------- Sign-in Page
router.post("/register", async(req, res) => {
    try {
        const { username, age, gender, email, pass, cpass } = req.body
        const match = await Model1.findOne({ email: email });
        if (match) {
            res.status(404).send("Data Already Valid");
        } else {
            if (pass === cpass) {
                const colldata = new Model1({
                    username, age, gender, email, pass
                });
                const senddata = await colldata.save();
                res.status(201).send(senddata);
                console.log(senddata);
            } else {
                res.status(404).status("Plz Enter Both Correct Password");
            }
        }
    } catch (error) {
        res.status(404).send("Internal Errort 🛠")
        console.error(error);
    }
})
// ------------------------------ Login Page
router.post("/login", async (req, res) => {
    try {
        const { email, pass } = req.body;
        console.log(`Email : ${email} || Password : ${pass}`);
        const match = await Model1.findOne({ email: email });
        if (match) {
            const match2 = bcrypt.compare(pass, match.pass);
            if (match2) {
                const token = await match.generateAuthToken();
                res.json({ token: token });
                console.log("Signin :  " + token);
                
                console.log("Login Successfully");
               
            }
       }
        
    } catch (error) {
        console.log(error);
    }
})
// ----------------- Update Page
router.post("/updatepass", async (req, res) => {
    try {
        const { email , pass , cpass } = req.body;
        const match = await Model1.findOne({ email: email });
        if (!match) {
            res.send("data Not Vaild")
        } else {
            if (pass === cpass) {
                const newhashpass = await bcrypt.hash(pass, 12);
                const updatedata = await Model1.findOneAndUpdate({email : email} , {$set : {pass : newhashpass}});
                console.log(updatedata);
                res.status(201).send(updatedata);
                
            } else {
                res.send("Password Does Not Match")
            }
        }
    } catch (error) {
        console.log(error);
    }
})
// --------------------- About Page
router.post('/about', authenticate ,  (req, res) => {
    res.json({
        dataverify : req.dataverify
    })
    
});
// --------------------- Contact Page
router.post("/contact", authenticate ,  (req, res) => {
    res.json({
        dataverify : req.dataverify
    })
})
// ------------------------ Home Page
router.post("/home", authenticatehome , (req, res) => {
    res.json({
    userverify : req.userverify
   })
})
// -------------------------- Portfolio Page
router.post("/portfolio", async (req, res) => {
    res.send("This is Portfolio Page")
})
// --------------------------- Logout Page
router.post("/logout", async (req, res) => {
    const logoutmsg = "Logout Successfully"
    res.json({
       logoutmsg : logoutmsg
    })
});


module.exports = router;