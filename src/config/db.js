const Pool = require("pg").Pool;
require('dotenv').config({path: '../../.env'})

const pool = new Pool({
  user: process.env.USER_VALUE,
  password: process.env.PASSWORD_VALUE,
  database: process.env.DATABASE,
  host: process.env.HOST,
  port: process.env.DB_PORT,
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
