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
def accessPlanet(conn, c, pid):
	# gid int, ssid int, pid int, type int, name varchar(50)
	c.execute("SELECT * FROM planetary_systems WHERE pid = ?", (pid,))
	planet = c.fetchone()
	if len(planet) > 0:
		

# update ship

if __name__ == '__main__':
	main()


