const express = require("express")
const router = express.Router();
require("../db/dbconnection1");
const Model1 = require("../collections/collection_1");
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
 //---------------------------------
router.get("/", (req, res) => {
    res.render("home");
});
 
router.get("/register", (req, res) => {
    res.render("signup");
});

router.get("/signin", (req, res) => {
    res.render("signin");
})

router.get("*", (req, res) => {
    res.send("404 Page not found")
})
//--------------------------------

router.post("/register", async (req, res) => {
    try {
        const { username, pass, cpass, age } = req.body;
        const match1 = await Model1.findOne({ username: username });
        if (match1) {
            res.status(401).send("Sorry Invalid Data");
        } else {
            if (pass === cpass) {
                const datas = new Model1({
                    username: username,
                    age: age,
                    pass: pass,
                    cpass: cpass
                });
                const savedata = await datas.save();
                res.status(201).send(savedata);
                console.log(savedata);
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Internal Server Problem");
    }

});

router.post("/signin", async (req, res) => {
    try {
        const { username, pass } = req.body;
        const match = await Model1.findOne({ username: username }); // Verify the Username From Database
        if (match) {
            const match2 = await bcrypt.compare(pass, match.pass); // Verify the user Login [pass] to database pass 
            if (!match2) {
                res.status(404).send("Password Not match from database");
            } else {
                console.log(match2);
                const token = await match.generateAuthToken();
                res.status(201).send("Login Successfully");
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Problem");
    }
})
//------------------------------------
module.exports = router