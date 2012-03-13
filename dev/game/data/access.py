#!/usr/bin/python

import sqlite3 as sq

def connect():
	conn = sq.connect('game.db')
	c = conn.cursor()
	return conn, c

def runner(fn, *args):
	conn, c = connect()
	fn(conn, c, *args)
	conn.close()

# access planet

# update ship

if __name__ == '__main__':
	main()


