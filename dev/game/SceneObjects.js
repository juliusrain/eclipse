//collection of sceneObjects to provide accessibility to all game components (ai, game engine)


var sceneElements = {   mainShip: null,
                        AIShips: [],
                        lasers: [],
                        missiles: [],
                        env_objects: [],
                        explosions: []
                    };

//contains HUD elements, updated by graphics engine (crosshairs, etc...)
var HUDElements = [];