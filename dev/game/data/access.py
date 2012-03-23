#!/usr/bin/python

import sqlite3 as sq
import json

SKYBOX = 0

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
	planet = {}
	# retrieve specific planet
	# 0 gid int, 1 ssid int, 2 pid int, 3 type int, 4 name varchar(50)
	# {type: SKYBOX, parameters:{name:"skybox", textures:["", "", "", "", "", "skybox/starfield.png"]}};
	c.execute("SELECT * FROM planetary_systems WHERE gid = ? AND ssid = ? AND pid = ?", (gid, ssid, pid))
	given = c.fetchone()
	# if none are found, return an empty object
	if not given or len(given) <= 0:
		return planet
	# tell it that it's a skybox
	planet['type'] = SKYBOX
	# provide its name
	planet['gameParameters'] = given[4]
	# retrieve the skybox for the planet
	# 0 type int, 1 top varchar(100), 2 bottom varchar(100), 3 front varchar(100), 4 back varchar(100), 5 leftside varchar(100), 6 rightside varchar(100)
	c.execute("SELECT * FROM preset_planetary_systems WHERE type=?", (given[3],))
	preset = c.fetchone()
	if not preset or len(preset) <= 0:
		return {}
	planet['textures'] = preset[3:6]
	return planet

# access objects at planet def accessObjectsAt(conn, c, gid, ssid, pid): c.execute("SELECT * FROM ") 
# update ship

def main():
	print 'database access program.'

if __name__ == '__main__':
	main()


