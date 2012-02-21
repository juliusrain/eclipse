var gameObjects = []

var skybox = {  type: SKYBOX,
                parameters: {
                    name: "skybox",
                    textures: [ "textures/skybox/starfield.png", "textures/skybox/starfield.png",
                                "textures/skybox/starfield.png", "textures/skybox/starfield.png",
                                "textures/skybox/starfield.png", "textures/skybox/starfield.png"]
                }
            };
gameObjects.push(skybox);

var playerShip = {  type: PLAYER_SHIP,
                    gameParameters: {   //game related parameters
                        name: "mainShip", //model number?
                        engine: {   level: 0,
                                    speed: 1,
                                    turnFactor: 1.5 //also used by graphics engine
                        },
                        armor: {},
                        health: 100,
                        weapons: {
                            lasers: {
                                type: 0, //particle vs elongated?
                                damage: 0,
                                range: 500,
                                speed: 10,
                                amount: 50,
                                maxCharge: 100,
                                currentCharge: 0,

                            },
                            missiles: {

                            }
                        },
                        inventory: {},
                    },
                    drawParameters: {   //graphics/drawing related parameters
                        shipID: 0,
                        geometry: "models/ships/prototype1big.js",
                        laserModel: "models/lasers/laser.js",
                        material: "", //not sure if this will be needed, still waiting on textured blender model
                        crosshair: "textures/crosshair/crosshair.png", //can have different types of crosshairs for different ships

                        tiltRotationCurrent: 0, //can make these specific to engine
                        tiltRotationMax: 0.4, //radians

                        position: {x: 0, y: 0, z: 0} //starting position in scene when not main ship
                    }
                };
gameObjects.push(playerShip);

var AIShip = {  type: AI_SHIP,

                gameParameters: {
                    name: "aiShip", //model number?
                    engine: {   level: 0,
                                speed: 1,
                                turnFactor: 1.2
                    },
                    armor: {},
                    health: 100,
                    weapons: {
                        lasers: {
                            type: 0, //particle vs elongated?
                            damage: 0,
                            range: 500,
                            speed: 10,
                            amount: 30,

                        },
                        missiles: {

                        }
                    },
                    inventory: {},
                },
                drawParameters: {
                    shipID: 1,
                    geometry: "models/ships/prototype1big.js",
                    material: "", //not sure if this will be needed, still waiting on textured blender model
                    laserModel: "models/lasers/laser.js",
                    tiltRotationCurrent: 0, //can make these specific to engine
                    tiltRotationMax: 20,

                    position: {x: 0, y: 0, z: -50} //starting position in scene when not main ship
                }
            };
gameObjects.push(AIShip);

var AIShip2 = { type: AI_SHIP,

                gameParameters: {
                    name: "aiShip1", //model number?
                    engine: {   level: 0,
                                speed: 1,
                                turnFactor: 1.2
                    },
                    armor: {},
                    health: 100,
                    weapons: {
                        lasers: {
                            type: 0, //particle vs elongated?
                            damage: 0,
                            range: 500,
                            speed: 10,
                            amount: 25,

                        },
                        missiles: {

                        }
                    },
                    inventory: {},
                },
                drawParameters: {
                    shipID: 2,
                    geometry: "models/ships/prototype1big.js",
                    material: "", //not sure if this will be needed, still waiting on textured blender model
                    laserModel: "models/lasers/laser.js",
                    tiltRotationCurrent: 0, //can make these specific to engine
                    tiltRotationMax: 20,

                    position: {x: 30, y: 0, z: -20} //starting position in scene when not main ship
                }
            };
gameObjects.push(AIShip2);
