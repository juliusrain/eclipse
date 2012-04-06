//git clone https://tooocoool@github.com/juliusrain/361project.git
function AI() {
	this.radar_range = 400;
	this.firing_range = 200;
	this.limit = 200;
}

AI.prototype.react = function() {
    
    //player contains main ship position
	var player = sceneElements.mainShip.position;
	
	//loop through each ship 
	for (i in sceneElements.AIShips) {
	
	    //get AI ship position
		var AIship = sceneElements.AIShips[i].position;
		
		//compute the vector from player ship to 
		var dx = player.x - AIship.x;
		dx = dx * dx;
		var dy = player.y - AIship.y;
		dy = dy * dy;
		var dz = player.z - AIship.z;
		dz = dz * dz;
		var p2ai_distance = (dx + dy + dz);
		
		//if the player ship is in the radar range, hunt the player ship 
		if (p2ai_distance <= (this.radar_range * this.radar_range)) {
			//if (p) {
				var s2p = {x: (player.x - AIship.x), y: (player.y - AIship), z: (player.z- AIship.z)};
				//var p_dir = sceneElements.mainShip.direction;
				var ai_dir = sceneElements.AIShips[i].direction;
				
				sceneElements.AIShips[i].turn(ai_dir.x + s2p.x, ai_dir.y + s2p.y, ai_dir.z + pdir_);
				//sceneElements.AIShips[i].turn(player.x, player.y, player.z);
			//}
				
				if (sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout == 0) {
					if (p2ai_distance <= (this.firing_range * this.firing_range)) {
						
						sceneElements.AIShips[i].fireLaser();
						sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout = 12;
					}
					
				} else if (sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout > 0 ){
					 sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout--;
				}
				
		}
		
		
	}
}
