const pool = require("../config/db");
const catchAsync = require("../utils/catchAsync");
const { signJWTToken } = require("../config/signToken");
const authValidator = require("../validation/auth.validation");

exports.AuthenticateUser = catchAsync(async (req, res, next) => {
  const validatedResult = await authValidator
    .authenticate()
    .validateAsync(req.body, { abortEarly: false });

  console.log(req.validatedResult);
  const { email, password } = validatedResult;
  const newPool = await pool.query("SELECT * FROM profile WHERE email = $1", [
    email,
  ]);
  if (newPool.rows[0] != null && newPool.rows[0].password == password) {
    const token = await signJWTToken(newPool.rows[0].userid);
    if (token) {
      res.cookie("authorization", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, //Valid for seven days
        httpOnly: true,
      });
    }

    return res.status(200).send("Login Successful, TOKEN: " + token);
  } else {
    return res.status(403).send("Login Failed");
  }
});
