#!/usr/bin/python

import sqlite3 as sq
import json

def connect():
	conn = sq.connect('game.db')
	c = conn.cursor()
	return conn, c

def runner(fn, *args):
	conn, c = connect()
	fn(conn, c, *args)
	conn.close()

# access planet
# pid -> json
def accessPlanet(conn, c, gid, ssid, pid):
	# gid int, ssid int, pid int, type int, name varchar(50)
	# {type: SKYBOX, parameters: { name: "skybox",textures: [ "skybox/starfield.png", "skybox/starfield.png", "skybox/starfield.png", "skybox/starfield.png", "skybox/starfield.png", "skybox/starfield.png"]}};
	planet = {}
	c.execute("SELECT * FROM planetary_systems WHERE gid = ? AND ssid = ? AND pid = ?", (gid, ssid, pid))
	planet = c.fetchone()
	if len(planet) > 0:
		

# access objects at planet
def accessObjectsAt(conn, c, gid, ssid, pid):
	c.execute("SELECT * FROM ")

# update ship

def main():
	print 'database access program.'

if __name__ == '__main__':
	main()


