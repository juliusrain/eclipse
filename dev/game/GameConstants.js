/*
 * game object constants/identifiers, can add as we go along
 *
 */

//for drawing game scenes
var SKYBOX = 0,
    PLAYER_SHIP = 10,
    AI_SHIP = 11,

    CROSSHAIR = 90,
    RING = 91,
    MINIMAP = 92;

var EXPLOSION_LARGE = 0;

// values
var EATING = 100;


//for planet types
var PLANET_TYPE = {};

var GAS_GIANT = 0,
    ROCK_PLANET = 1;

PLANET_TYPE[GAS_GIANT] = {
        textures: [ //array of 6 strings for this planet's skybox

        ],
        small_texture: "", //texture of small planet
    };

// Network URL
URL = "ws://cgi.cs.mcgill.ca:8080/ws"
