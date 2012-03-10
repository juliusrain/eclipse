#!/usr/bin/python

import sqlite3 as sq

def connect():
	conn = sq.connect('game.db')
	c = conn.cursor()
	return conn, c


if __name__ == '__main__':
	main()


