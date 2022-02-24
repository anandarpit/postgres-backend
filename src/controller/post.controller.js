const pool = require("../config/db");
const catchAsync = require("../utils/catchAsync");


exports.CreatePost = catchAsync(async (req, res, next) => {
    const userId = res.locals.payload.sub;

    const {title, description} = req.body;
    const created_at = Date.now().toString();

    const newPool = await pool.query(
        "INSERT INTO app.posts (userId, title, description, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
        [userId, title, description, created_at]
    );

    return res.status(200).json({"postId" : newPool.rows[0].postid, "title" : newPool.rows[0].title, "description" : newPool.rows[0].description, "created_at" : newPool.rows[0].created_at});

})