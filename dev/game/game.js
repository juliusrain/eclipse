/*
  Primary Game Module
    Encapsulates all the components of the game.
*/

//collection of sceneObjects to provide accessibility to all game components (ai, game engine)
var sceneElements = {   mainShip: null,
                        AIShips: [],
                        netShips: [],
                        lasers: [],
                        missiles: [],
                        env_objects: [],
                        explosions: []
                    };
var graphicsEngine, gameEngine, ai, network;
gameEngine = new GameEngine();
gameEngine.first();
//graphicsEngine.startEngine();

