var gameObjects = []

var skybox = {  type: SKYBOX,
                parameters: {
                    name: "skybox",
                    /*textures: [ "textures/skybox/starfield.png", "textures/skybox/starfield.png",
                                "textures/skybox/starfield.png", "textures/skybox/starfield.png",
                                "textures/skybox/starfield.png", "textures/skybox/starfield.png"]*/
                    textures: [ "skybox/starfield.png", "skybox/starfield.png",
                                "skybox/starfield.png", "skybox/starfield.png",
                                "skybox/starfield.png", "skybox/starfield.png"]
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
                        maxHealth: 10000,
                        repairRate: 100,
                        repairCost: {food:1, fuel: 1, metals:15},
                        weapons: {
                            lasers: {
                                type: 0, //particle vs elongated?
                                damage: 0,
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
						spheres:{
							outer:{
								x:0,
								y:0,
								z:0,
								r:50
							},
							inner:[]
						},
                    },
                    drawParameters: {   //graphics/drawing related parameters
                        shipID: 0,
                        geometry: "models/ships/player_ship002_scaled_copy.js",
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
                            range: 300,
                            speed: 70,
                            amount: 30,

                        },
                        missiles: {

                        }
                    },
                    inventory: {},
					spheres:{
						outer:{
							x:0,
							y:0,
							z:0,
							r:50
						},
						inner:[]
					},
                },
                drawParameters: {
                    shipID: 1,
                    geometry: "models/ships/player_ship002_scaled_copy.js",
                    material: "", //not sure if this will be needed, still waiting on textured blender model
                    laserModel: "models/lasers/laser.js",
                    tiltRotationCurrent: 0, //can make these specific to engine
                    tiltRotationMax: 20,

                    position: {x: 0, y: 0, z: 300} //starting position in scene when not main ship
                }
            };
gameObjects.push(AIShip);

var AIShip2 = {  type: AI_SHIP,

                gameParameters: {
                    name: "aiShip2", //model number?
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
                            range: 300,
                            speed: 70,
                            amount: 30,

                        },
                        missiles: {

                        }
                    },
                    inventory: {},
					spheres:{
						outer:{
							x:0,
							y:0,
							z:0,
							r:50
						},
						inner:[]
					},
                },
                drawParameters: {
                    shipID: 2,
                    geometry: "models/ships/player_ship002_scaled_copy.js",
                    material: "", //not sure if this will be needed, still waiting on textured blender model
                    laserModel: "models/lasers/laser.js",
                    tiltRotationCurrent: 0, //can make these specific to engine
                    tiltRotationMax: 20,

                    position: {x: 0, y: 0, z: -300} //starting position in scene when not main ship
                }
            };
gameObjects.push(AIShip2);
