const Pool = require("pg").Pool;

const pool = new Pool({
  user: "hxjadajhfsrent",
  password: "a5ad49dd6616c8797264a37c65f44b9088e03d3c32c617080dbd191794c17ea2",
  database: "d22d2mhjemu0te",
  host: "ec2-67-202-63-147.compute-1.amazonaws.com",
  port: 5432,
  ssl: true,
  ssl: { rejectUnauthorized: false },
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query(
    "CREATE TABLE IF NOT EXISTS profile( userId SERIAL PRIMARY KEY, name varchar(255) NOT NULL,email varchar(255) UNIQUE NOT NULL,username varchar(255) UNIQUE NOT NULL,password varchar(255) NOT NULL); CREATE TABLE IF NOT EXISTS followRelation(userId int NOT NULL,follows int NOT NULL);CREATE TABLE IF NOT EXISTS posts(postId SERIAL PRIMARY KEY,userId int NOT NULL,title varchar(255) NOT NULL,description TEXT NOT NULL,created_at TEXT NOT NULL);CREATE TABLE IF NOT EXISTS likes(postId int NOT NULL, userId int NOT NULL);CREATE TABLE IF NOT EXISTS comments(commentId SERIAL PRIMARY KEY,postId int NOT NULL,userId int NOT NULL,comment TEXT NOT NULL,created_at TEXT NOT NULL);",
    (err, result) => {
      release();
      if (err) {
        return console.error("Error executing query", err.stack);
      }
      console.log("Connected to Database !");
    }
  );
});

module.exports = pool;
