

//git clone https://tooocoool@github.com/juliusrain/361project.git
function AI() {

    this.radar_range = 600;
//  this.firing_range = 400;
//  this.limit = 400;
    this.radar_range = 100;
    this.firing_range = 50;
    this.flying_range = 1000;
    this.max_speed = 3;

}

AI.prototype.react = function() {
    
    //player contains main ship position
    var player_pos = sceneElements.mainShip.position;
    var player_dir = sceneElements.mainShip.direction;
    var double_radar = this.radar_range * this.radar_range;
    var double_firing = this.firing_range * this.firing_range;
    var double_flying = this.flying_range * this.flying_range;
    
    var i;
    var seed = Date.now() * 0.0008;
    
    //loop through each ship 
    for (i in sceneElements.AIShips) {
    
        //get AI ship position
        var AIship_pos = sceneElements.AIShips[i].position;
        var AIship_speed = sceneElements.AIShips[i].gameParameters.engine.speed;
        var dummy = sceneElements.AIShips[i].gameParameters.dummy_target;
        
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
        
        
        //if the player ship is in the radar range, hunt the player ship 
        if (p2ai_distance <= double_radar && p2ai_distance && cur_range < double_flying) {
                        
            //vector from player to aiship
            var player2ship = {x: (player_pos.x - AIship_pos.x), y: (player_pos.y - AIship_pos.y), z: (player_pos.z- AIship_pos.z)};
                
            //var p_dir = sceneElements.mainShip.direction;
            var ai_dir = sceneElements.AIShips[i].direction;
            //sceneElements.AIShips[i].turn((ai_dir.x + player_dir.x), ai_dir.y + player_dir.y, ai_dir.z + player_dir.z);
            sceneElements.AIShips[i].turn(player_pos.x, player_pos.y, player_pos.z);
            sceneElements.AIShips[i].translateZ(-AIship_speed);
            
            //fire at the player if it's in firing range
            if (p2ai_distance <= double_firing) {
                if (sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout === 0) {
                
                    
                    sceneElements.AIShips[i].fireLaser();
                    sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout = 12;
                }

                //sceneElements.AIShips[i].turn((ai_dir.x + player_dir.x), ai_dir.y + player_dir.y, ai_dir.z + player_dir.z);
                sceneElements.AIShips[i].turn(player_pos.x, player_pos.y, player_pos.z);
                //sceneElements.AIShips[i].translateZ(-2);
            //}
                //fire at the player if it's in firing range
                if (sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout == 0) {
                    if (p2ai_distance <= (this.firing_range * this.firing_range)) {
                        
                        sceneElements.AIShips[i].fireLaser();
                        sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout = 20;
                    }

                    
                } else if (sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout > 0 ){
                    sceneElements.AIShips[i].gameParameters.weapons.lasers.timeout--;
                }
            }
            //increase the speed to chase the player
            else {
                if (AIship_speed < this.max_speed )
                    sceneElements.AIShips[i].gameParameters.engine.speed += 0.002;
            }
                
        }
        //otherwise AIships just follow a certain path 
        else {
            dummy.x = 2000*Math.cos(seed);              
            dummy.y = 2000*Math.sin(seed);
            dummy.z = 800*Math.sin(seed);
            sceneElements.AIShips[i].turn(dummy.x, dummy.y, dummy.z);
            sceneElements.AIShips[i].translateZ(-AIship_speed);
            //sceneElements.AIShips[i].gameParameters.dummy_target.x = dummy.x;
            //sceneElements.AIShips[i].gameParameters.dummy_target.y = dummy.y;
            //sceneElements.AIShips[i].gameParameters.dummy_target.z = dummy.z;
        }
                        
    }
};

