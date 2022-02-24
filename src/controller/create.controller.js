const pool = require("../config/db");
const catchAsync = require("../utils/catchAsync");

exports.CreateUser = catchAsync(async (req, res, next) => {
  //TODO: Add validation here
  console.log(req.body);
  const { name, email, username , password} = req.body;
  const newPool = await pool.query(
    "INSERT INTO app.profile (name, email,username, password) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, email,username, password]
  );
  return res.status(200).json(newPool);
});

