const Model1 = require("../Database_Collections/Col1");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const authenticate = async (req, res, next) => {
  const token = await req.body.tokendata;
  const verify = jwt.verify(token, process.env.SEC);
  const dataverify = await Model1.findOne({ _id: verify._id, "tokens.token": token });
  if (!dataverify) {
      throw new Error("Data Does not Verify")
  } else {
    console.log(`\n Username  : ${dataverify.username} \n Email : ${dataverify.email}`);
    req.dataverify = dataverify;
    next();
  }
};

module.exports = authenticate;
