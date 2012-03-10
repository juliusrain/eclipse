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

import conf

define("PORT", help="run on the given port", type=int)
define("ROOT", help="root URL", type=str)
define("DEBUG", help="debug mode on/off", type=bool)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (options.ROOT+"ws", WSHandler)
        ]        
        settings = {
            "debug": options.DEBUG
        }
        
        tornado.web.Application.__init__(self, handlers, **settings)
        
class WSHandler(tornado.websocket.WebSocketHandler):
    listeners = set()
    
    def open(self):
        WSHandler.listeners.add(self)
        logging.info("new listener: %d listener(s)" % len(WSHandler.listeners))
    
    def on_close(self):
        WSHandler.listeners.remove(self)
        logging.info("listener removed: %d listener(s)" % len(WSHandler.listeners))
        
    def on_message(self, message):
        logging.info("got message %r", message)
        try:
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
        except ValueError:
            logging.error("wtf that wasn't json")
            
def main():
    tornado.options.parse_config_file("server.conf")
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.PORT)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
