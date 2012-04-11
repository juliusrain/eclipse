var gameObjects = []

var skybox = {  type: SKYBOX,
                parameters: {
                    name: "skybox",
                    /*textures: [ "skybox/starfield.png", "skybox/starfield.png",
                                "skybox/starfield.png", "skybox/starfield.png",
                                "skybox/starfield.png", "skybox/starfield.png"]*/
                    textures: [ "skybox/testbox2/posx.jpg", "skybox/testbox2/negx.jpg",
                                "skybox/testbox2/posy.jpg", "skybox/testbox2/negy_planet.jpg",
                                "skybox/testbox2/posz.jpg", "skybox/testbox2/negz.jpg"]
                }
            };
gameObjects.push(skybox);

var playerShip = {  type: PLAYER_SHIP,
                    gameParameters: {   //game related parameters
                        name: "mainShip", //model number?
                        engine: {   level: 0,
                                    speed: 2,
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
                                speed: 40,
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
                        geometry: "models/ships/player_ship002w.js",
//                        geometry: "models/ships/AIship002.js",
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
                                speed: 2,
                                turnFactor: 1.2
                    },
                    armor: {},
                    health: 1000,
                    weapons: {
                        lasers: {
                            type: 0, //particle vs elongated?
                            damage: 100,
                            range: 300,
                            speed: 40,
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
//                    geometry: "models/ships/player_ship001w.js",
                    geometry: "models/ships/AIship002.js",
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
                                speed: 2,
                                turnFactor: 1.2
                    },
                    armor: {},
                    health: 1000,
                    weapons: {
                        lasers: {
                            type: 0, //particle vs elongated?
                            damage: 100,
                            range: 300,
                            speed: 40,
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
                            positions: [    //100 total
                                {x:886, y:81, z: 147, rx: 190, ry: 183, rz: 271},
                                {x:-591, y:-123, z: 266, rx: 44, ry: 93, rz: 63},
                                {x:629, y:-284, z: -925, rx: 237, ry: 304, rz: 247},
                                {x:758, y:284, z: 385, rx: 342, ry: 189, rz: 229},
                                {x:-660, y:-158, z: 987, rx: 354, ry: 210, rz: 131},
                                {x:-798, y:249, z: -348, rx: 41, ry: 160, rz: 71},
                                {x:-700, y:-425, z: 823, rx: 99, ry: 12, rz: 320},
                                {x:401, y:-94, z: 448, rx: 321, ry: 26, rz: 331},
                                {x:673, y:194, z: -247, rx: 45, ry: 143, rz: 235},
                                {x:504, y:-98, z: -801, rx: 131, ry: 76, rz: 211},
                                {x:-580, y:202, z: -753, rx: 249, ry: 139, rz: 104},
                                {x:65, y:-460, z: 736, rx: 272, ry: 23, rz: 140},
                                {x:-891, y:-184, z: -795, rx: 96, ry: 86, rz: 96},
                                {x:-483, y:88, z: -231, rx: 224, ry: 48, rz: 264},
                                {x:-8, y:-218, z: -800, rx: 267, ry: 202, rz: 261},
                                {x:328, y:-408, z: 677, rx: 113, ry: 214, rz: 330},
                                {x:-730, y:-355, z: -950, rx: 311, ry: 54, rz: 162},
                                {x:-492, y:326, z: 125, rx: 11, ry: 342, rz: 108},
                                {x:-982, y:-497, z: 808, rx: 269, ry: 344, rz: 260},
                                {x:-435, y:-85, z: -966, rx: 250, ry: 69, rz: 4},
                                {x:-974, y:-480, z: 828, rx: 35, ry: 118, rz: 98},
                                {x:-876, y:319, z: -419, rx: 22, ry: 171, rz: 8},
                                {x:177, y:-131, z: 578, rx: 1, ry: 318, rz: 73},
                                {x:316, y:147, z: 694, rx: 204, ry: 238, rz: 14},
                                {x:-790, y:282, z: -283, rx: 1, ry: 345, rz: 320},
                                {x:-487, y:-473, z: 635, rx: 313, ry: 288, rz: 252},
                                {x:-654, y:-190, z: -989, rx: 148, ry: 264, rz: 256},
                                {x:735, y:-312, z: 400, rx: 321, ry: 11, rz: 219},
                                {x:103, y:-163, z: -165, rx: 358, ry: 333, rz: 93},
                                {x:-19, y:251, z: 663, rx: 62, ry: 100, rz: 54},
                                {x:-207, y:-312, z: 776, rx: 163, ry: 178, rz: 146},
                                {x:752, y:390, z: 217, rx: 94, ry: 240, rz: 270},
                                {x:-702, y:395, z: 307, rx: 101, ry: 265, rz: 305},
                                {x:-969, y:316, z: 304, rx: 211, ry: 332, rz: 119},
                                {x:184, y:-360, z: -960, rx: 206, ry: 96, rz: 347},
                                {x:42, y:-478, z: 249, rx: 39, ry: 305, rz: 95},
                                {x:-816, y:15, z: -759, rx: 290, ry: 85, rz: 21},
                                {x:949, y:-202, z: -338, rx: 296, ry: 280, rz: 256},
                                {x:-603, y:-436, z: 379, rx: 297, ry: 1, rz: 300},
                                {x:294, y:219, z: -727, rx: 8, ry: 284, rz: 14},
                                {x:-353, y:-255, z: -950, rx: 346, ry: 257, rz: 332},
                                {x:941, y:-287, z: -512, rx: 220, ry: 300, rz: 29},
                                {x:955, y:226, z: 206, rx: 203, ry: 60, rz: 292},
                                {x:794, y:49, z: -381, rx: 160, ry: 101, rz: 157},
                                {x:850, y:401, z: 207, rx: 100, ry: 60, rz: 213},
                                {x:-618, y:-45, z: 615, rx: 111, ry: 81, rz: 347},
                                {x:71, y:-177, z: 61, rx: 72, ry: 298, rz: 196},
                                {x:673, y:484, z: -368, rx: 233, ry: 139, rz: 238},
                                {x:904, y:79, z: 323, rx: 25, ry: 315, rz: 54},
                                {x:753, y:-107, z: 315, rx: 304, ry: 333, rz: 301},
                                {x:-890, y:-206, z: 123, rx: 341, ry: 252, rz: 28},
                                {x:638, y:-84, z: 385, rx: 239, ry: 324, rz: 205},
                                {x:-868, y:430, z: -726, rx: 75, ry: 91, rz: 276},
                                {x:158, y:-376, z: 44, rx: 184, ry: 202, rz: 31},
                                {x:-326, y:-253, z: 780, rx: 5, ry: 302, rz: 105},
                                {x:699, y:-139, z: 945, rx: 158, ry: 244, rz: 16},
                                {x:-938, y:-196, z: 205, rx: 45, ry: 278, rz: 144},
                                {x:-1, y:261, z: -261, rx: 234, ry: 257, rz: 354},
                                {x:-335, y:182, z: -217, rx: 25, ry: 187, rz: 181},
                                {x:-150, y:-162, z: -181, rx: 12, ry: 252, rz: 276},
                                {x:96, y:-203, z: 700, rx: 43, ry: 22, rz: 69},
                                {x:340, y:-30, z: -113, rx: 221, ry: 163, rz: 359},
                                {x:407, y:-366, z: -198, rx: 208, ry: 345, rz: 31},
                                {x:257, y:-339, z: -453, rx: 305, ry: 163, rz: 80},
                                {x:775, y:-77, z: 131, rx: 154, ry: 120, rz: 302},
                                {x:156, y:-58, z: -236, rx: 57, ry: 338, rz: 310},
                                {x:123, y:25, z: -901, rx: 6, ry: 274, rz: 267},
                                {x:-539, y:-10, z: 176, rx: 6, ry: 192, rz: 106},
                                {x:944, y:-442, z: -62, rx: 5, ry: 150, rz: 11},
                                {x:-774, y:148, z: 85, rx: 252, ry: 0, rz: 169},
                                {x:940, y:292, z: 965, rx: 304, ry: 242, rz: 224},
                                {x:-611, y:-322, z: 905, rx: 131, ry: 297, rz: 195},
                                {x:519, y:168, z: 4, rx: 230, ry: 302, rz: 181},
                                {x:628, y:-254, z: 488, rx: 273, ry: 135, rz: 274},
                                {x:175, y:89, z: 167, rx: 260, ry: 309, rz: 90},
                                {x:348, y:392, z: -747, rx: 167, ry: 136, rz: 326},
                                {x:-599, y:56, z: 97, rx: 209, ry: 334, rz: 42},
                                {x:-128, y:414, z: -891, rx: 202, ry: 322, rz: 343},
                                {x:-703, y:137, z: 180, rx: 51, ry: 315, rz: 124},
                                {x:781, y:234, z: -767, rx: 232, ry: 305, rz: 311},
                                {x:-657, y:-400, z: 825, rx: 230, ry: 324, rz: 47},
                                {x:-471, y:296, z: -156, rx: 219, ry: 276, rz: 320},
                                {x:38, y:-168, z: -732, rx: 25, ry: 60, rz: 293},
                                {x:662, y:-207, z: 335, rx: 168, ry: 263, rz: 23},
                                {x:38, y:-422, z: -187, rx: 211, ry: 221, rz: 306},
                                {x:-767, y:-30, z: 436, rx: 305, ry: 338, rz: 232},
                                {x:-721, y:-342, z: -202, rx: 53, ry: 337, rz: 184},
                                {x:-482, y:143, z: 647, rx: 265, ry: 67, rz: 326},
                                {x:758, y:-398, z: -758, rx: 69, ry: 106, rz: 277},
                                {x:879, y:-180, z: -922, rx: 289, ry: 129, rz: 48},
                                {x:-513, y:-113, z: -469, rx: 333, ry: 282, rz: 185},
                                {x:656, y:476, z: -28, rx: 24, ry: 235, rz: 194},
                                {x:128, y:-86, z: -268, rx: 320, ry: 44, rz: 168},
                                {x:418, y:378, z: -831, rx: 6, ry: 241, rz: 64},
                                {x:-454, y:58, z: 508, rx: 21, ry: 269, rz: 265},
                                {x:239, y:122, z: -261, rx: 222, ry: 251, rz: 65},
                                {x:888, y:490, z: 0, rx: 289, ry: 169, rz: 339},
                                {x:-50, y:60, z: 145, rx: 254, ry: 266, rz: 184},
                            ],
                            bounds: [
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                                {spheres: { x: 0, y: 0, z: 0, r: 40}},
                            ],
                            count: 10, // max 100
                        },
                    };

gameObjects.push(asteroid_field);



var netShip = {  type: NET_SHIP,
                    gameParameters: {   //game related parameters
                        name: "netShip", //model number?
                        engine: {   level: 0,
                                    speed: 2,
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
                                speed: 40,
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
                        geometry: "models/ships/player_ship001w.js",
                        laserModel: "models/lasers/laser.js",
                        material: "", //not sure if this will be needed, still waiting on textured blender model
                        crosshair: "textures/crosshair/crosshair.png", //can have different types of crosshairs for different ships

                        tiltRotationCurrent: 0, //can make these specific to engine
                        tiltRotationMax: 0.4, //radians

                        position: {x: 0, y: 0, z: 0} //starting position in scene when not main ship
                    }
                };
