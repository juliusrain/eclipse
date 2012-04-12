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

import data.access as db

define("PORT", help="run on the given port", type=int)
define("ROOT", help="root URL", type=str)
define("DEBUG", help="debug mode on/off", type=bool)

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (options.ROOT, MainHandler),
            (options.ROOT+"ws", WSHandler),
        ]        
        settings = {
            "debug": options.DEBUG,
            "xsrf_cookies": True,
            "autoescape": None,
            "cookie_secret": "43oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
        }
        
        tornado.web.Application.__init__(self, handlers, **settings)
        
class MainHandler(tornado.web.RequestHandler):
    def get(self):
	    self.write(db.test())

class WSHandler(tornado.websocket.WebSocketHandler):
    listeners = set()
    
    def allow_draft76(self):
        # for iOS 5.0 Safari
        return True
        
    def open(self):
        WSHandler.listeners.add(self)
        logging.info("new listener: %d listener(s)" % len(WSHandler.listeners))
    
    def on_close(self):
        WSHandler.listeners.remove(self)
        logging.info("listener removed: %d listener(s)" % len(WSHandler.listeners))
        
    def on_message(self, message):
        try:
            parsed = tornado.escape.json_decode(message)
            try:
                action = parsed["action"]
                body = parsed["body"]
                if action == "chat":
                    for listener in WSHandler.listeners:
                        listener.write_message(message)
                elif action == "pos":
                    for listener in WSHandler.listeners:
                        listener.write_message(message)
                elif action == "broad":
                    logging.info("broadcasting to %d listeners" % len(WSHandler.listeners))
                    logging.info(message)
                    for listener in WSHandler.listeners:
                        listener.write_message(message)
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
                    logging.info(message)
            except KeyError:
                logging.error("No action found in parsed JSON string.")
        except ValueError:
            logging.error("WTF that wasn't JSON.")
            
def main():
    tornado.options.parse_config_file("server.conf")
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.PORT)
    tornado.ioloop.IOLoop.instance().start()
    print "started."

if __name__ == "__main__":
    main()
