CREATE DATABASE parties;

--set extention
create extension if not exists "uuid-ossp"

CREATE TABLE users(
	user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_email VARCHAR(255) NOT NULL,
	user_password VARCHAR(255) NOT NULL
);

CREATE TABLE parties(
	room_id VARCHAR(255) PRIMARY KEY NOT NULL,
	room_members INTEGER NOT NULL,
	room_name VARCHAR(255),
	room_uri  VARCHAR(255),
	active_members INTEGER NOT NULL
);



-- INSERT INTO users (user_name , user_email, user_password) VALUES ("krane" , "krane@gmail.com", "krane123");
--insert fake users
-- INSERT INTO users (user_name,user_email,user_password) VALUES ('henry','henryhsiesh@gmail.com','helloworld123');