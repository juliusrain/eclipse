var gameObjects = []

var skybox = {  type: SKYBOX,
                parameters: {
                    name: "skybox",
                    textures: [ "textures/skybox/px.jpg", "textures/skybox/nx.jpg",
                                "textures/skybox/py.jpg", "textures/skybox/ny.jpg",
                                "textures/skybox/pz.jpg", "textures/skybox/nz.jpg"]
                }
            };
gameObjects.push(skybox);

var playerShip = {  type: PLAYER_SHIP,
                    gameParameters: {   //game related parameters
                        name: "mainShip", //model number?
                        engine: {   level: 0,
                                    speed: 1,
                                    turnFactor: 1.2 //also used by graphics engine
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

                            },
                            missiles: {

                            }
                        },
                        inventory: {},
                    },
                    drawParameters: {   //graphics/drawing related parameters

                        geometry: "models/ships/prototype1.js",
                        laserModel: "models/lasers/laser.js",
                        material: "", //not sure if this will be needed, still waiting on textured blender model
                        crosshair: "textures/crosshair/crosshair.png", //can have different types of crosshairs for different ships

                        tiltRotationCurrent: 0, //can make these specific to engine
                        tiltRotationMax: 20,

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
                            amount: 25,

                        },
                        missiles: {

                        }
                    },
                    inventory: {},
                },
                drawParameters: {

                    geometry: "models/ships/prototype1.js",
                    material: "", //not sure if this will be needed, still waiting on textured blender model
                    laserModel: "models/lasers/laser.js",
                    tiltRotationCurrent: 0, //can make these specific to engine
                    tiltRotationMax: 20,

                    position: {x: 0, y: 0, z: -50} //starting position in scene when not main ship
                }
            };
gameObjects.push(AIShip);
