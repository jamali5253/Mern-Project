const Model1 = require("../Database_Collections/Col1");
const jwt = require("jsonwebtoken");

const authenticatehome = async (req , res , next) => {
    try {
        const token = await req.body.tokendata;
        const verify = jwt.verify(token, process.env.SEC);
        const userverify = await Model1.findOne({ _id: verify._id, "tokens.token": token });
        if (userverify) {
            req.userverify = userverify
        } else {
            res.status(404);
         console.log("Not Verify");
        }
        next()
    } catch (error) {
        res.status(404).json({
            err : "Authenticate does have some issue"
        })
    }
}

module.exports = authenticatehome;