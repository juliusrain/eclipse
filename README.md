WALDO
=====

Hello visitor! This is the home of WALDO, a browser-based game written for COMP 361, a software engineering course at McGill University.

Dependencies
============

* [THREE.js](https://github.com/mrdoob/three.js/)
* [Tornado](https://github.com/facebook/tornado/)
* [SQLite](http://www.sqlite.org/)
* [jQuery](http://jquery.com/)

Play (on Chromium)
===============

1. Clone a copy of the repository into your public_html
2. Set up configuration:  
    $ edit dev/game/server/server.conf  
    $ edit dev/game/GameConstants.js  
3. Start the server:   
    $ python dev/game/server/server.py  
4. Configure Chromium 
    Enable the following (in about:flags)
    * Override software rendering list
    * GPU Accelerated Drawing
    * GPU Accelerated Canvas 2D
5. Start the game
    $ chromium-browser --allow-file-access-from-files dev/game/index.html
