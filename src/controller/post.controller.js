const pool = require("../config/db");
const catchAsync = require("../utils/catchAsync");
const postValidator = require("../validation/posts.validation");

exports.CreatePost = catchAsync(async (req, res, next) => {
  const userId = res.locals.payload.sub;

  const validatedResult = await postValidator
    .CreatePost()
    .validateAsync(req.body, {
      abortEarly: false,
    });

  const { title, description } = validatedResult;
  const created_at = Date.now().toString();

  const newPool = await pool.query(
    "INSERT INTO posts (userId, title, description, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, title, description, created_at]
  );

  return res.status(200).json({
    postId: newPool.rows[0].postid,
    title: newPool.rows[0].title,
    description: newPool.rows[0].description,
    created_at: newPool.rows[0].created_at,
  });
});

exports.DeletePost = catchAsync(async (req, res, next) => {
  const userId = res.locals.payload.sub;

  const validatedResult = await postValidator
    .DeletePost()
    .validateAsync(req.body, {
      abortEarly: false,
    });

  const { postId } = validatedResult;
  console.log(postId);

  const newPool = await pool.query(
    "SELECT * FROM posts WHERE postId = $1 AND userId = $2",
    [postId, userId]
  );

  if (newPool.rows.length === 0) {
    return res.status(404).json({ message: "Either post does not exist or you are the not the creator of the post" });
  } else {
    await pool.query("DELETE FROM posts WHERE postId = $1", [postId]);
    return res.status(200).json({ message: "Post deleted" });
  }
});

exports.LikePost = catchAsync(async (req, res, next) => {
  const userId = res.locals.payload.sub;

  const validatedResult = await postValidator
    .LikePost()
    .validateAsync(req.body, {
      abortEarly: false,
    });

  const { postId } = validatedResult;

  const newPool = await pool.query("SELECT * FROM posts WHERE postId = $1", [
    postId,
  ]);

  if (newPool.rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  } else {
    //check if like already present in
    const like = await pool.query(
      "SELECT * FROM likes WHERE userId = $1 AND postId = $2",
      [userId, postId]
    );
    if (like.rows.length > 0) {
      return res.status(400).json({ message: "Already liked" });
    } else {
      //Insert a like
      await pool.query("INSERT INTO likes (userId, postId) VALUES ($1, $2)", [
        userId,
        postId,
      ]);
      return res.status(200).json({ message: "Post liked" });
    }
  }
});

exports.UnlikePost = catchAsync(async (req, res, next) => {
  const userId = res.locals.payload.sub;

  const validatedResult = await postValidator.UnlikePost().validateAsync(req.body, {
    abortEarly: false,
  })
  const { postId } = validatedResult;

  const newPool = await pool.query("SELECT * FROM posts WHERE postId = $1", [
    postId,
  ]);

  if (newPool.rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  } else {
    //check if like is present or not
    const like = await pool.query(
      "SELECT * FROM likes WHERE userId = $1 AND postId = $2",
      [userId, postId]
    );
    if (like.rows.length === 0) {
      return res.status(400).json({ message: "Not liked yet" });
    } else {
      await pool.query("DELETE FROM likes WHERE userId = $1 AND postId = $2", [
        userId,
        postId,
      ]);
      return res.status(200).json({ message: "Post Unliked" });
    }
  }
});

exports.AddComment = catchAsync(async (req, res, next) => {
  const userId = res.locals.payload.sub;

  const validatedResult = await postValidator.AddComment().validateAsync(req.body, {
    abortEarly: false,
  })

  const { postId, comment } = validatedResult;

  const newPool = await pool.query("SELECT * FROM posts WHERE postId = $1", [
    postId,
  ]);

  if (newPool.rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  } else {
    //Insert a comment
    const myPool = await pool.query(
      "INSERT INTO comments (userId, postId, comment, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, postId, comment, Date.now().toString()]
    );
    return res.status(200).json({ commentId: myPool.rows[0].commentid });
  }
});

exports.GetCount = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const newPool = await pool.query("SELECT * FROM posts WHERE postId = $1", [
    postId,
  ]);

  if (newPool.rows.length === 0) {
    return res.status(404).json({ message: "Post not found" });
  } else {
    const commentsCount = await pool.query(
      "SELECT COUNT(*) FROM comments WHERE postId = $1",
      [postId]
    );

    const likeCount = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE postId = $1",
      [postId]
    );

    res.status(200).json({
      comments: commentsCount.rows[0].count,
      likes: likeCount.rows[0].count,
    });
  }
});

exports.GetAllPosts = catchAsync(async (req, res, next) => {
  const userId = res.locals.payload.sub;

  const newPool = await pool.query(
    "SELECT posts.postid, posts.title, posts.description, posts.created_at, ARRAY_AGG(comments.comment) AS comments, (select COUNT(likes.postid)from likes where likes.postid = posts.postid) as likes FROM posts LEFT JOIN comments  ON comments.postid=posts.postid  WHERE posts.userid= $1 GROUP BY posts.title, posts.description, posts.created_at, posts.postid",
    [userId]
  );

  if (newPool.rows.length === 0) {
    return res.status(404).json({ message: "No posts found" });
  } else {
    return res.status(200).json({
      posts: newPool.rows,
    });
  }
});

// "SELECT array_to_string(ARRAY_AGG(DISTINCT app.posts.postid), ',') AS postid, app.posts.title, (SELECT COUNT(*) FROM app.likes WHERE app.likes.postid = 2) AS likes, array_to_string(ARRAY_AGG(DISTINCT app.posts.description), ',') AS description, array_to_string(ARRAY_AGG(DISTINCT app.posts.created_at), ',') AS created_at, ARRAY_AGG(app.comments.comment) AS comments FROM app.posts LEFT JOIN app.comments ON app.comments.postid=app.posts.postid WHERE app.posts.userid=1 GROUP BY app.posts.title"
