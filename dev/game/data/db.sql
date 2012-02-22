
CREATE TABLE active_objects (
  gid int,
  ssid int,
  pid int,
  oid int,
  x int,
  y int
);



CREATE TABLE games (
  gid int auto_increment,
  status int,
  owner int
);



CREATE TABLE multi_games (
  gid int,
  uid int,
  ssid int,
  pid int
);



CREATE TABLE objects (
  oid int auto_increment,
  type int,
  current_stats text
);



CREATE TABLE planetary_systems (
  gid int,
  ssid int,
  pid int,
  type int,
  name varchar(50)
);



CREATE TABLE preset_objects (
  type int auto_increment,
  model varchar(100),
  texture varchar(100),
  initial_stats text
);



CREATE TABLE preset_planetary_systems (
  type int auto_increment,
  top varchar(100),
  bottom varchar(100),
  front varchar(100),
  back varchar(100),
  leftside varchar(100),
  rightside varchar(100)
);

INSERT INTO preset_planetary_systems (type, top, bottom, front, back, leftside, rightside) VALUES
(0, 'sky/py.jpg', 'sky/ny.jpg', 'sky/nz.jpg', 'sky/pz.jpg', 'sky/nx.jpg', 'sky/px.jpg'),
(1, 'skybox/starfield.png', 'skybox/starfield.png', 'skybox/starfield.png', 'skybox/starfield.png', 'skybox/starfield.png', 'skybox/starfield.png'),


CREATE TABLE single_games (
  gid int,
  uid int,
  ssid int,
  pid int
);



CREATE TABLE solar_systems (
  gid int,
  ssid int,
  x int,
  y int,
  name varchar(50)
);



CREATE TABLE users (
  uid int auto_increment,
  type int,
  uname varchar(50),
  email varchar(50),
  password varchar(50),
  status int
);


INSERT INTO users (uid, type, uname, email, password, status) VALUES
(1, 1, 'bw', 'bw@cool.com', 'iamcool', 1),
(2, 1, 'cw', 'cw@success.com', 'iamawesome', 1),
(3, 1, 'sl', 'sl@music.com', 'iamcool', 1),
(4, 1, 'qht', 'qht@hockeylove.com', 'iamawesome', 1);
