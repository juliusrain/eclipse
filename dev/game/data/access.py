#!/usr/bin/python

import sqlite3 as sq
import json
from random import randint

SKYBOX = 0

##################################################
# Database Functions
##################################################

def connect():
	conn = sq.connect('game.db')
	c = conn.cursor()
	return conn, c

def runner(fn):
	def newfn(*args, **kwargs):
		conn, c = connect()
		value = fn(conn, c, *args, **kwargs)
		conn.close()
		return value
	newfn.__name__ = fn.__name__
	newfn.__doc__ = newfn.__doc__
	return newfn

##################################################
# Access Functions
##################################################


# access planet
# pid -> json
@runner
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

##################################################
# Randomize Functions
##################################################

def randomName():
	# THIS IS TEMPORARY!
	chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	string = ""
	for i in range(randint(10,20)):
		string += chars[randint(0, len(chars)-1)]
	return string


##################################################
# Generator Functions
##################################################

# generate a random planet
# possible arguments: name, type
@runner
def createPlanet(conn, c, **kw):
	planet = {'parameters':{}, 'gameParameters':{}}
	chosen = 0
	if 'type' in kw:
		# selected specified type
		chosen = kw['type']
	else:
		# get random type
		types = c.execute("select type from preset_planetary_systems").fetchall()
		types = [e[0] for e in types]
		print types
		chosen = types[randint(0,len(types)-1)]
		print chosen
	skybox = c.execute("select * from preset_planetary_systems where type = ?", str(chosen)).fetchone()
	if skybox:
		textures = skybox[1:7]
		planet['type'] = SKYBOX
		planet['parameters']['name'] = 'skybox'
		planet['parameters']['textures'] = textures
	planet['gameParameters']['type'] = chosen
	if 'name' in kw:
		planet['gameParameters']['name'] = kw['name']
	else:
		planet['gameParameters']['name'] = randomName()
	return planet

def main():
	print '###########################'
	print '# database access program #'
	print '###########################'

if __name__ == '__main__':
	main()


