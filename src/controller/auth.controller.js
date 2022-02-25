const pool = require("../config/db");
const catchAsync = require("../utils/catchAsync");
const {signJWTToken} =require("../config/signToken");


exports.AuthenticateUser =catchAsync(async (req, res, next) => {
    //TODO: Add validation here
    console.log(req.body);
    const { email, password } = req.body;
    const newPool = await pool.query(
        "SELECT * FROM profile WHERE email = $1", [email]
    )
    if(newPool.rows[0] != null && newPool.rows[0].password == password){

        const token = await signJWTToken(newPool.rows[0].userid);
        if (token) {
          res.cookie("authorization", token, {
            maxAge: 1000 * 60 * 60 * 24 * 7, //Currently valid for seven days
            httpOnly: true,
          });
        }

        return res.status(200).send("Login Successful, TOKEN: " + token);
    }
    else{
        return res.status(403).send("Login Failed");
    }

})
