
//chooser
function ch(defined, def) {
	if(typeof defined == "undefined"){
		return def;
	}
	else{
		return defined;
	}
}

// Main player object
function Player(loader) {
	var loaded = typeof loader == "undefined" ? {} : loader;
	//turn, adjustSpeed, medium jump, fire weapon

	// SETTINGS
	// Current Status
	var x = ch(loaded.x, 0); // x-coordinate within the current solar system
	var y = ch(loaded.y, 0); // y-coordinate within the current solar system
	var orientation = ch(loaded.orientation, Math.random() * 2 * Math.PI); // clockwise angle in radians relative to due right

	var health = ch(loaded.health, 100); // percentage of overall health
	var recoveryRate = ch(loaded.recoveryRate, 0.01); // unaided recovery percentage per frame

	// Propulsion - Short Range
	var curSpeed = ch(loaded.curSpeed, 0); // current speed
	var maxSpeed = ch(loaded.maxSpeed, 20); // maximum sublight
	var speedStep = ch(loaded.speedStep, 2); // amount of increase/decrease in speed per keypress
	var turnStep = ch(loaded.turnStep, Math.PI / 9); // amount of turn in raidans per keypress (at standstill)

	// Propulsion - Jump
	var jumpCharge = ch(loaded.jumpCharge, 100); // percentage of jump engine
	var jumpRechargeRate = ch(loaded.jumpRechargeRate, 1); // unaided engine recharge per frame

	// Propulsion - Medium Jump
	var minMedJumpRange = ch(loaded.minMedJumpRange, 200); // the closest the player can jump
	var maxMedJumpRange = ch(loaded.maxMedJumpRange, 1000); // the farthest the player can jump
	var medJumpInaccuracy = ch(loaded.medJumpInaccuracy, 50); // radius of inaccuracy at maximum range
	var medJumpCost = ch(loaded.medJumpCost, 20); // amount it costs to perform a medium jump (all medium jumps cost the same regardless of distance)
	
	return {
		// nudge the player in a CW (positive) or CCW (negative) direction
		turn: function (direction) {
			if(direction > 0){
				orientation = (orientation + turnStep) % (Math.PI * 2);
			}
			else if(direction < 0){
				orientation = ((Math.PI * 2) + orientation - turnStep) % (Math.PI * 2);
			}
		},
		// adjust the player speed up or down
		adjustSpeed: function (acc) {
			if(acc > 0 && curSpeed < maxSpeed){
				curSpeed += speedStep;
				if(curSpeed > maxSpeed){
					curSpeed = maxSpeed;
				}
			}
			else if(acc < 0 && curSpeed > 0){
				curSpeed -= speedStep;
				if(curSpeed < 0){
					curSpeed = 0;
				}
			}
		},
		mediumJump: function () {},
		fireWeapon: function () {},
		hit: function () {},
	};
}
