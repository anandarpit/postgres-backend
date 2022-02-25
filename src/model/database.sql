CREATE DATABASE social_app;

\ connect 'social_app';

CREATE SCHEMA app;

SET
    search_path TO app;

CREATE TABLE IF NOT EXISTS profile(
    userId SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    email varchar(255) UNIQUE NOT NULL,
    username varchar(255) UNIQUE NOT NULL,
    password varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS followRelation(
    userId int NOT NULL,
    follows int NOT NULL
);

CREATE TABLE IF NOT EXISTS posts(
    postId SERIAL PRIMARY KEY,
    userId int NOT NULL,
    title varchar(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS likes(
    postId int NOT NULL,
    userId int NOT NULL
);

CREATE TABLE IF NOT EXISTS comments(
    commentId SERIAL PRIMARY KEY,
    postId int NOT NULL,
    userId int NOT NULL,
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL
);