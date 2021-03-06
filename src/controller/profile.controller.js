const pool = require("../config/db");
const catchAsync = require("../utils/catchAsync");
const ProfileValidator = require("../validation/profile.validation");
exports.FollowUser = catchAsync(async (req, res, next) => {
  const validatedResult = await ProfileValidator.FollowUser().validateAsync(
    req.body,
    {
      abortEarly: false,
    }
  );
  const userId = res.locals.payload.sub;

  if (validatedResult.id == userId) {
    return res.status(403).send("You cannot follow yourself");
  } else {
    const following = await pool.query(
      "SELECT * FROM followRelation WHERE userId = $1 AND follows = $2",
      [userId, validatedResult.id]
    );
    if (following.rows.length == 0) {
      await pool.query(
        "INSERT INTO followRelation (userId, follows) VALUES ($1, $2) RETURNING *",
        [userId, validatedResult.id]
      );

      return res.status(200).send("You are now following this user");
    } else {
      return res.status(403).send("You are already following this user");
    }
  }
});

exports.UnfollowUser = catchAsync(async (req, res, next) => {
  const userId = res.locals.payload.sub;
  const validatedResult = await ProfileValidator.UnfollowUser().validateAsync(
    req.body,
    {
      abortEarly: false,
    }
  );

  if (validatedResult.id == userId) {
    return res.status(403).send("You cannot unfollow yourself");
  } else {
    const following = await pool.query(
      "SELECT * FROM followRelation WHERE userId = $1 AND follows = $2",
      [userId, validatedResult.id]
    );
    if (following.rows.length != 0) {
      await pool.query(
        "DELETE FROM followRelation WHERE userId = $1 AND follows = $2",
        [userId, validatedResult.id]
      );

      return res.status(200).send("You have successfully unfollowed this user");
    } else {
      return res.status(403).send("You don't follow this user");
    }
  }
});

exports.GetUser = catchAsync(async (req, res, next) => {
  const userId = res.locals.payload.sub;
  const getUsername = await pool.query(
    "SELECT * FROM profile WHERE userId = $1",
    [userId]
  );
  console.log(getUsername);

  const getFollowersCount = await pool.query(
    "SELECT COUNT(*) FROM followRelation WHERE follows = $1",
    [userId]
  );

  const getFollowingCount = await pool.query(
    "SELECT COUNT(*) FROM followRelation WHERE userId = $1",
    [userId]
  );

  return res.status(200).json({
    username: getUsername.rows[0].username,
    followers: getFollowersCount.rows[0],
    following: getFollowingCount.rows[0],
  });
});
