var gameObjects = []

var skybox = {  type: SKYBOX,
                parameters: {
                    name: "skybox",
                    /*textures: [ "skybox/starfield.png", "skybox/starfield.png",
                                "skybox/starfield.png", "skybox/starfield.png",
                                "skybox/starfield.png", "skybox/starfield.png"]*/
                    textures: [ "skybox/testbox2/posx.jpg", "skybox/testbox2/negx.jpg",
                                "skybox/testbox2/posy.jpg", "skybox/testbox2/negy_gasgiant.jpg",
                                "skybox/testbox2/posz.jpg", "skybox/testbox2/negz.jpg"]
                }
            };
gameObjects.push(skybox);

var playerShip = {  type: PLAYER_SHIP,
                    gameParameters: {   //game related parameters
                        name: "mainShip", //model number?
                        engine: {   level: 0,
                                    speed: 1,
                                    turnFactor: 1.5, //also used by graphics engine
                                    longJumpCost: 50,
                                    medJumpCost: 20,
                                    rechargeRate: 1,
                                    rechargeCost: 1,
                                    currentCharge: 0,
                        },
                        armor: {},
                        health: 100,
                        maxHealth: 1000,
                        repairRate: 50,
                        repairCost: {food:1, fuel: 5, metals:15},
                        weapons: {
                            lasers: {
                                type: 0, //particle vs elongated?
                                damage: 100,
                                range: 300,
                                speed: 70,
                                amount: 50,
                                maxCharge: 15400,
                                currentCharge: 0,
                                rechargeRate: 350,
                                rechargeCost: 1,
                                fireCost: 500,
                            },
                            missiles: {

                            }
                        },
                        inventory: {},
                    },
                    drawParameters: {   //graphics/drawing related parameters
                        shipID: 0,
//                        geometry: "models/ships/player_ship002_scaled_copy.js",
                        geometry: "models/ships/player_ship001w.js",
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
                    health: 1000,
                    weapons: {
                        lasers: {
                            type: 0, //particle vs elongated?
                            damage: 100,
                            range: 300,
                            speed: 70,
                            amount: 30,
                            timeout: 12
                        },
                        missiles: {

                        }
                    },
                    dummy_target: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    origin: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    inventory: {},
                },
                drawParameters: {
                    shipID: 1,
                    geometry: "models/ships/player_ship001w.js",
                    material: "", //not sure if this will be needed, still waiting on textured blender model
                    laserModel: "models/lasers/laser.js",
                    tiltRotationCurrent: 0, //can make these specific to engine
                    tiltRotationMax: 20,

                    position: {x: 0, y: 0, z: 300} //starting position in scene when not main ship
                }
            };
gameObjects.push(AIShip);

var AIShip2 = { type: AI_SHIP,

                gameParameters: {
                    name: "aiShip2", //model number?
                    engine: {   level: 0,
                                speed: 1,
                                turnFactor: 1.2
                    },
                    armor: {},
                    health: 1000,
                    weapons: {
                        lasers: {
                            type: 0, //particle vs elongated?
                            damage: 100,
                            range: 300,
                            speed: 70,
                            amount: 30,
                            timeout:12
                        },
                        missiles: {

                        }
                    },
                    dummy_target: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    origin: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    inventory: {},
                },
                drawParameters: {
                    shipID: 2,
                    geometry: "models/ships/player_ship001w.js",
                    material: "", //not sure if this will be needed, still waiting on textured blender model
                    laserModel: "models/lasers/laser.js",
                    tiltRotationCurrent: 0, //can make these specific to engine
                    tiltRotationMax: 20,

                    position: {x: 0, y: 0, z: -300} //starting position in scene when not main ship
                }
            };
gameObjects.push(AIShip2);

var asteroid_field = {  type: ASTEROID_FIELD,
            
                        gameParameters: {
                            name: "asteroidfield",
                        },

                        drawParameters: {
                            geometry: "models/asteroids/asteroid2.js",
                            positions: [    
                                {x: 420, y: 100, z: -100},
                                {x: -700, y: 100, z: -400}, 
                                {x: -200, y: 120, z: -200}, 
                                {x: -90, y: 85, z: -150}, 
                                {x: 200, y: 90, z: -175}, 
                            ],
                            bounds: [
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                            ],
                            count: 5,
                        },
                    };

gameObjects.push(asteroid_field);



var netShip = {  type: NET_SHIP,
                    gameParameters: {   //game related parameters
                        name: "netShip", //model number?
                        engine: {   level: 0,
                                    speed: 1,
                                    turnFactor: 1.5, //also used by graphics engine
                                    longJumpCost: 50,
                                    medJumpCost: 20,
                                    rechargeRate: 1,
                                    rechargeCost: 1,
                                    currentCharge: 0,
                        },
                        armor: {},
                        health: 100,
                        maxHealth: 10000,
                        repairRate: 100,
                        repairCost: {food:1, fuel: 1, metals:15},
                        weapons: {
                            lasers: {
                                type: 0, //particle vs elongated?
                                damage: 100,
                                range: 300,
                                speed: 70,
                                amount: 50,
                                maxCharge: 15400,
                                currentCharge: 0,
                                rechargeRate: 350,
                                rechargeCost: 1,
                                fireCost: 500,
                            },
                            missiles: {

                            }
                        },
                        inventory: {},
                    },
                    drawParameters: {   //graphics/drawing related parameters
                        shipID: 0,
                        geometry: "models/ships/player_ship002_scaled_copy.js",
//                        geometry: "models/ships/player_ship003.js",
                        laserModel: "models/lasers/laser.js",
                        material: "", //not sure if this will be needed, still waiting on textured blender model
                        crosshair: "textures/crosshair/crosshair.png", //can have different types of crosshairs for different ships

                        tiltRotationCurrent: 0, //can make these specific to engine
                        tiltRotationMax: 0.4, //radians

                        position: {x: 0, y: 0, z: 0} //starting position in scene when not main ship
                    }
                };
