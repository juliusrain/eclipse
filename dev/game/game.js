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

var jumpMap = new JumpMap();
jumpMap.loadJumpMap();
jumpMap.animate();

var graphicsEngine = new GraphicsEngine();
graphicsEngine.loadGameplayObjects(gameObjects);
graphicsEngine.startEngine();

