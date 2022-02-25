const pool = require("../config/db");
const catchAsync = require("../utils/catchAsync");
const validator = require("../validation/create.validation");

exports.CreateUser = catchAsync(async (req, res, next) => {
  const validatedResult = await validator
    .CreateUser()
    .validateAsync(req.body, { abortEarly: false });

  const { name, email, username, password } = validatedResult;
  const following = await pool.query(
    "SELECT * FROM profile WHERE email = $1 OR username = $2",
    [email, username]
  );
  if (following.rows.length == 0) {
    const newPool = await pool.query(
      "INSERT INTO profile (name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, username, password]
    );

    return res.status(200).send("User created successfully");
  } else {
    return res.status(403).send("User already exists");
  }
});
