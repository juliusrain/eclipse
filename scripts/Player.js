// Main player object
function Player(ctx, loader) {
	// pl stores the internal state of the player object
	var pl = typeof loader == "object" ? loader : {};
	//turn, adjustSpeed, medium jump, fire weapon

	// SETTINGS
	// Current Status
	pl.x = Waldo.ch(pl.x, 0); // x-coordinate within the current solar system
	pl.y = Waldo.ch(pl.y, 0); // y-coordinate within the current solar system
	pl.orientation = Waldo.ch(pl.orientation, Math.random() * 2 * Math.PI); // clockwise angle in radians relative to due right

	pl.health = Waldo.ch(pl.health, 100); // percentage of overall health
	pl.recoveryRate = Waldo.ch(pl.recoveryRate, 0.01); // unaided recovery percentage per frame

	// Propulsion - Short Range
	pl.curSpeed = Waldo.ch(pl.curSpeed, 0); // current speed
	pl.maxSpeed = Waldo.ch(pl.maxSpeed, 20); // maximum sublight
	pl.speedStep = Waldo.ch(pl.speedStep, 2); // amount of increase/decrease in speed per keypress
	pl.turnStep = Waldo.ch(pl.turnStep, Math.PI / 9); // amount of turn in raidans per keypress (at standstill)

	// Propulsion - Jump
	pl.jumpCharge = Waldo.ch(pl.jumpCharge, 100); // percentage of jump engine
	pl.jumpRechargeRate = Waldo.ch(pl.jumpRechargeRate, 1); // unaided engine recharge per frame

	// Propulsion - Medium Jump
	pl.minMedJumpRange = Waldo.ch(pl.minMedJumpRange, 200); // the closest the player can jump
	pl.maxMedJumpRange = Waldo.ch(pl.maxMedJumpRange, 1000); // the farthest the player can jump
	pl.medJumpInaccuracy = Waldo.ch(pl.medJumpInaccuracy, 50); // radius of inaccuracy at maximum range
	pl.medJumpCost = Waldo.ch(pl.medJumpCost, 40); // amount it costs to perform a medium jump (all medium jumps cost the same regardless of distance)
	
	// Propulsion - Long Jump
	pl.maxLongJumpRange = Waldo.ch(pl.maxLongJumpRange, 1); // radius of solar systems reachable from the current location
	pl.longJumpCost = Waldo.ch(pl.longJumpCost, 90); // amount it costs to perform a long-range jump
	
	// Defence
	//shielding?
	
	// Offence - weapons
	pl.weapons = Waldo.ch(pl.weapons, {}); // onboard weapons
	
	return {
		// return read-only copy of all private variables (usu. for saving)
		dump: function () {
			var ret = {}, i;
			for(i in pl){
				ret[i] = pl[i];
			}
			return ret;
		},
		// nudge the player in a CW (positive) or CCW (negative) direction
		turn: function (direction) {
			if(direction > 0){
				pl.orientation = (pl.orientation + turnStep) % (Math.PI * 2);
			}
			else if(direction < 0){
				pl.orientation = ((Math.PI * 2) + pl.orientation - turnStep) % (Math.PI * 2);
			}
		},
		// adjust the player speed up or down
		adjustSpeed: function (acc) {
			if(acc > 0 && pl.curSpeed < pl.maxSpeed){
				pl.curSpeed += pl.speedStep;
				if(pl.curSpeed > pl.maxSpeed){
					pl.curSpeed = pl.maxSpeed;
				}
			}
			else if(acc < 0 && pl.curSpeed > 0){
				pl.curSpeed -= pl.speedStep;
				if(pl.curSpeed < 0){
					pl.curSpeed = 0;
				}
			}
		},
		mediumJump: function () {},
		longJump: function () {},
		fireWeapon: function () {},
		hit: function () {},
		draw: function () {
			var j = 20;
			for(var i in pl){
				ctx.fillText(i+": "+pl[i], 20, j);
				j += 10;
			}
		}
	};
}
