

//git clone https://tooocoool@github.com/juliusrain/361project.git
function AI() {

    this.radar_range = 1000;
    this.firing_range = 800;
    this.flying_range = 1200;
    this.max_speed = 2.2;
	this.safe_range = 500;
}

AI.prototype.react = function() {
    
    //player contains main ship position
    var player_pos = sceneElements.mainShip.position;
    var player_dir = sceneElements.mainShip.direction;
    var square_radar = this.radar_range * this.radar_range;
    var square_firing = this.firing_range * this.firing_range;
    var square_flying = this.flying_range * this.flying_range;
    var square_safe = this.safe_range * this.safe_range;
    
    var i;
    
    
    //loop through each ship 
    for (i in sceneElements.AIShips) {
    
		var seed = Date.now() * 0.00015;
        
        //get AI ship position
        var AIship_pos = sceneElements.AIShips[i].position;
        var AIship_speed = sceneElements.AIShips[i].gameParameters.engine.speed;
               
        //compute the vector from player ship to 
        var dx = player_pos.x - AIship_pos.x;
        dx = dx * dx;
        var dy = player_pos.y - AIship_pos.y;
        dy = dy * dy;
        var dz = player_pos.z - AIship_pos.z;
        dz = dz * dz;
        var p2ai_distance = (dx + dy + dz);
        
        dx = AIship_pos.x - sceneElements.AIShips[i].gameParameters.origin.x;
        dy = AIship_pos.y - sceneElements.AIShips[i].gameParameters.origin.y;
        dz = AIship_pos.z - sceneElements.AIShips[i].gameParameters.origin.z;
        var cur_range = dx*dx + dy*dy + dz*dz;
        
        
        //if the player ship is in the radar range and flying range, hunt the player ship 
        if (p2ai_distance <= square_radar && cur_range <= square_flying) {
              
            //vector from player to aiship
            //var player2ship = {x: (player_pos.x - AIship_pos.x), y: (player_pos.y - AIship_pos.y), z: (player_pos.z- AIship_pos.z)};
                
            
            var ai_dir = sceneElements.AIShips[i].direction;
            //sceneElements.AIShips[i].turn((ai_dir.x + player_dir.x), ai_dir.y + player_dir.y, ai_dir.z + player_dir.z);
            
            sceneElements.AIShips[i].turn(player_pos.x, player_pos.y, player_pos.z);
            
                if (sceneElements.AIShips[i].gameParameters.dir_timeout === 0){
                             var dx = Math.random() * 40;
                          var dy = Math.random() * 40;
                              var dz = Math.random() * 40;
                            sceneElements.AIShips[i].turn(player_pos.x + dx, player_pos.y+dy, player_pos.z+dz);
                        }
              
                    sceneElements.AIShips[i].gameParameters.dir_timeout -= 1;
                        if (sceneElements.AIShips[i].gameParameters.dir_timeout < 0) {
                            sceneElements.AIShips[i].gameParameters.dir_timeout = 200;
                        }   
                        
            
            //if the AI gets too close, it decelerates
            if (p2ai_distance <= square_safe) {
                AIship_speed -= 0.02;
            } 
            else {
                if (AIship_speed < this.max_speed)
                     AIship_speed += 0.02;
            
            }
            sceneElements.AIShips[i].translateZ(-AIship_speed);
            
            //fire at the player if it's in firing range
            if (p2ai_distance <= square_firing) {
            
                
                //sceneElements.AIShips[i].turn((ai_dir.x + player_dir.x), ai_dir.y + player_dir.y, ai_dir.z + player_dir.z);
                
                  
               
            
                   
                if (sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout === 0) {
                   
                   
                        //console.log(i + ": " + sceneElements.AIShips[i].gameParameters.dir_timeout);
                        //if (sceneElements.AIShips[i].gameParameters.dir_timeout === 0){
                        
                            
                        
                      
                        sceneElements.AIShips[i].fireLaser();
                        sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout = 20;
                        
                    

                    
                } else if (sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout > 0 ) {
                    sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout--;
                }
                 
               
                
            }
            //increase the speed to chase the player
            else {
                if (AIship_speed < this.max_speed )
                    sceneElements.AIShips[i].gameParameters.engine.speed += 0.0002;
            }
            
                
        }
        //otherwise AIships just follow a certain path 
        else {
                    
                                   
            var dummy = sceneElements.AIShips[i].gameParameters.dummy_target;             
            sceneElements.AIShips[i].turn(dummy.x, dummy.y, dummy.z);
            sceneElements.AIShips[i].translateZ(-AIship_speed);
            dummy.x = sceneElements.AIShips[i].gameParameters.origin.x + sceneElements.AIShips[i].gameParameters.orbit_radius * (2 * Math.cos(seed));     
            dummy.y = sceneElements.AIShips[i].gameParameters.origin.y + sceneElements.AIShips[i].gameParameters.orbit_radius * (0.6 * Math.sin(seed));
     
        }
                        
    }
};


