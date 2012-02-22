/*
  Primary Game Module
    Encapsulates all the components of the game.
*/

//collection of sceneObjects to provide accessibility to all game components (ai, game engine)
var sceneElements = {   mainShip: null,
                        AIShips: [],
                        lasers: [],
                        missiles: [],
                        env_objects: [],
                        explosions: []
                    };

var graphicsEngine, gameEngine, network;
gameEngine = new GameEngine();
//graphicsEngine.startEngine();

