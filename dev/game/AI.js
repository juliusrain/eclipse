//git clone https://tooocoool@github.com/juliusrain/361project.git
function AI() {
    this.radar_range = 1000;
    this.firing_range = 1;
    this.limit = 400;
}

AI.prototype.react = function() {
    
    //player contains main ship position
    var player = sceneElements.mainShip.position;
    var player_dir = sceneElements.mainShip.direction;
    
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
            
                //vector from player to aiship
                var player2ship = {x: (player.x - AIship.x), y: (player.y - AIship.y), z: (player.z- AIship.z)};
                
                //var p_dir = sceneElements.mainShip.direction;
                var ai_dir = sceneElements.AIShips[i].direction;
                
                //sceneElements.AIShips[i].turn((ai_dir.x + player_dir.x), ai_dir.y + player_dir.y, ai_dir.z + player_dir.z);
                sceneElements.AIShips[i].turn(player.x, player.y, player.z);
                //sceneElements.AIShips[i].translateZ(-2);
            //}
                //fire at the player if it's in firing range
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
