CREATE DATABASE social_app;

    CREATE TABLE profile(
        userId SERIAL PRIMARY KEY,
        name varchar(255) NOT NULL,
        email varchar(255) UNIQUE NOT NULL,
        username varchar(255) UNIQUE NOT NULL
        password varchar(255) NOT NULL
    );


    CREATE TABLE followRelation(
        userId int(10) NOT NULL,
        follows int(10) NOT NULL
    );


    CREATE TABLE posts(
        postId SERIAL PRIMARY KEY,
        userId int NOT NULL,
        title varchar(255) NOT NULL,
        description TEXT NOT NULL,
        created_at TEXT NOT NULL
    );