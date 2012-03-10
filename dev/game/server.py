#!/usr/bin/python

"""Server for websocket communication.
"""

import logging
import tornado.escape
import tornado.ioloop
import tornado.options
import tornado.web
import tornado.websocket

from tornado.options import define, options

define("port", default=8080, help="run on the given port", type=int)
#define("root", default="/~sli90/", help="root URL", type=str)
define("root", default="/~bwong117/", help="root URL", type=str)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            #(options.root, MainHandler),
            (options.root+"ws", WSHandler)
        ]
        tornado.web.Application.__init__(self, handlers)
        
class WSHandler(tornado.websocket.WebSocketHandler):
    listeners = set()
    
    def open(self):
        WSHandler.listeners.add(self)
        logging.info("new listener: %d listeners" % len(listeners))
    
    def on_close(self):
        WSHandler.listeners.remove(self)
        logging.info("listener removed: %d listeners" % len(listeners))
        
    def on_message(self, message):
        logging.info("got message %r", message)
        parsed = tornado.escape.json_decode(message)
        action = parsed["action"]
        body = parsed["body"]
        if action == "chat":
            pass
        elif action == "pos":
            pass
        elif action == "new":
            pass
        elif action == "retr":
            pass
        elif action == "save":
            pass
        elif action == "over":
            pass
        else:
            logging.info("unknown action %r" % action)
            
def main():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
