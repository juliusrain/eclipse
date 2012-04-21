// Game Engine
function GameEngine() {

    this.gameID = 0;// = <?php echo $number; ?>;//get from game maker?
    this.solarSystem = 0;
    this.planet = ROCK_PLANET;

    this.player_state = null;

    this.playerName = "";
    this.playerMode = "single";
    if(window.location.hash) {
        var amper = window.location.hash.indexOf("&");
        if(amper !== -1) {
            var portions = window.location.hash.split("&");
            if(portions[0] === "#multi") {
                this.playerMode = "multi";
            }
            if(portions.length > 1) {
                this.playerName = portions[1];
            }
        }
    }

    this.resources = {
        food:10000,
        fuel:10000,
        metals:10000,
    };
	this.miningStatus = 0;
	this.miningTimeout = 0;
	this.miningRange = 20000;
	this.autoMining = true;
    this.stage = 0;
    this.autorepair = true;
    this.timeouts = {
        lasers:0,
        food:0,
    };
    this.logicwait = 0;
    this.playerDead = false;

    this.nid = Math.floor(Math.random() * 99999);

    ai = new AI();
    this.numAI = 2;
    this.nextWaveWait = 20;

    //start network client
    network = new Network();
    network.connect();
    if(this.playerMode === "single") {
        network.disconnect();
    }
    this.netShipsAdded = [];
    this.firing = false;

    // new game portion - NO NEED FOR THIS!
       // call database, create new game(?)
       // call database, retrieve types info, generate solar systems/planets
    // create graphicsEngine
    //graphicsEngine = new GraphicsEngine();
    //this.load(this.solarSystem, this.planet);
    //graphicsEngine.loadGameplayObjects(gameObjects);
}

GameEngine.prototype.first = function () {
    graphicsEngine = new GraphicsEngine();
    this.load(this.solarSystem, this.planet);
};

// Death Clause for Player Ship
GameEngine.prototype.die = function (){
    sceneElements.mainShip.gameParameters.health = 0;
    graphicsEngine.addExplosionLarge(sceneElements.mainShip.position.x, sceneElements.mainShip.position.y, sceneElements.mainShip.position.z);
    this.logicwait = -1;
    // transmit message to network
    if(this.playerMode === "multi" && network.ws.readyState === 1) {
        var message = {action:'pos', body:{}};
		// pid
		message.body.pid = this.planet;
        // net id
        message.body.nid = this.nid;
		// name
		message.body.pname = this.playerName;
        // health
        message.body.health = sceneElements.mainShip.gameParameters.health;
        // positon
        message.body.x = round2(sceneElements.mainShip.position.x);
        message.body.y = round2(sceneElements.mainShip.position.y);
        message.body.z = round2(sceneElements.mainShip.position.z);
        // rotation
        message.body.quat = {};
        message.body.quat.w = sceneElements.mainShip.quaternion.w;
        message.body.quat.x = sceneElements.mainShip.quaternion.x;
        message.body.quat.y = sceneElements.mainShip.quaternion.y;
        message.body.quat.z = sceneElements.mainShip.quaternion.z;
        // shooting
        message.body.dead = true;
        //console.log(JSON.stringify(message));
        network.send(message);
    }
    if(!this.playerDead) {
        this.playerDead = true;
        alert("YOU HAVE DIED.");
    }
    // reset everything
    // health + game parameters
    $.extend(true, sceneElements.mainShip.gameParameters, playerShip.gameParameters);
    // new position
    graphicsEngine.gameplay_camera.position.x = Math.random()*10000-5000;
    graphicsEngine.gameplay_camera.position.y = Math.random()*10000-5000;
    graphicsEngine.gameplay_camera.position.z = Math.random()*10000-5000;
    // resume
    this.logicwait = 0;
    // send the respawn signal
    if(this.playerMode === "multi" && network.ws.readyState === 1) {
        var message = {action:'pos', body:{}};
		// pid
		message.body.pid = this.planet;
        // net id
        message.body.nid = this.nid;
		// name
		message.body.pname = this.playerName;
        // health
        message.body.health = sceneElements.mainShip.gameParameters.health;
        // positon
        message.body.x = round2(sceneElements.mainShip.position.x);
        message.body.y = round2(sceneElements.mainShip.position.y);
        message.body.z = round2(sceneElements.mainShip.position.z);
        // rotation
        message.body.quat = {};
        message.body.quat.w = sceneElements.mainShip.quaternion.w;
        message.body.quat.x = sceneElements.mainShip.quaternion.x;
        message.body.quat.y = sceneElements.mainShip.quaternion.y;
        message.body.quat.z = sceneElements.mainShip.quaternion.z;
        // shooting
        shooting = false;
        message.body.respawn = true;
        //console.log(JSON.stringify(message));
        network.send(message);
    }
    this.playerDead = false;
};

// Death Clause for AI or net Ships
GameEngine.prototype.kill = function (victim){
    victim.gameParameters.health = 0;
    graphicsEngine.addExplosionLarge(victim.position.x, victim.position.y, victim.position.z);
    if(victim.gameParameters.hasOwnProperty('nid')) {
        var vic = this.netShipsAdded.indexOf(victim.gameParameters.nid);
        if(vic !== -1) {
            this.netShipsAdded.splice(vic, 1);
        }
    }
    graphicsEngine.removeSceneObject(victim.objectID);
};

// Check for remaining AIs, spawn more
GameEngine.prototype.nextWave = function () {
	// if there are no more AIs
	if(!sceneElements.AIShips.length) {
		if(!this.nextWaveWait) {
			//respawn more AIs
			this.numAI++;
			for(var i = 0; i < this.numAI; i++) {
				var newAI = {};
				if(Math.round(Math.random())) {
					newAI = $.extend(true, {}, AIShip);
				}
				else {
					newAI = $.extend(true, {}, AIShip2);
				}
				newAI.gameParameters.health = 1000;
				newAI.drawParameters.position.x = Math.random() * 3000 - 1500;
				newAI.drawParameters.position.y = Math.random() * 3000 - 1500;
				newAI.drawParameters.position.z = Math.random() * 3000 - 1500;
				newAI.gameParameters.origin.x = Math.random() * 3000 - 1500;
				newAI.gameParameters.origin.y = Math.random() * 3000 - 1500;
				newAI.gameParameters.origin.z = Math.random() * 3000 - 1500;
				newAI.gameParameters.dummy_target.x = Math.random() * 3000 - 1500;
				newAI.gameParameters.dummy_target.y = Math.random() * 3000 - 1500;
				newAI.gameParameters.dummy_target.z = Math.random() * 3000 - 1500;
				graphicsEngine.addGameObject(newAI);
			}
			this.nextWaveWait = 20;
		}
		else{
			this.nextWaveWait--;
		}
	}
};


//Jump function
GameEngine.prototype.jump = function (ssid, pid){
	if(sceneElements.mainShip.gameParameters.engine.currentCharge >= sceneElements.mainShip.gameParameters.engine.longJumpCost) {
		sceneElements.mainShip.gameParameters.engine.currentCharge -= sceneElements.mainShip.gameParameters.engine.longJumpCost;
	    this.solarSystem = ssid;
	    this.planet = pid;
	    network.disconnect();
	    graphicsEngine.deleteScene();
	//    graphicsEngine.stopEngine();
	//    this.save();
	    this.load(ssid, pid);
	}
	else {
		network.broadcast({body: "Not enough engine charge to make the jump."});
	}
	toggleJumpMap();
};

// GameEngine save function
// called prior to jumping to another planet
GameEngine.prototype.save = function () {

};

// GameEngine load function
// called when jumping into another system
GameEngine.prototype.load = function (ssid, pid) {
    // wipe everything
    //     clear
    //$('#loader').show();
    // determine winning or losing state

    // get information from network
    console.log("preparing to load");
    var received = network.retrievePlanet(this.gameID, ssid, pid);
    console.log(received);
    console.log("got stuff, pushing it in");
    graphicsEngine.loadGameplayObjects(received);
    console.log("graphics engine has it now");
    this.solarSystem = ssid;
    this.planet = pid;
    console.log("doing other stuff");

    // trigger GraphicsEngine
    graphicsEngine.startEngine();
    network.connect();
    // remove loader screen
    $('#loader').hide();
    //console.log('hey this is really where I am! ' + sceneElements.mainShip.position);
};

GameEngine.prototype.updateResourcesBar = function () {
    $('#food span').html(this.resources.food);
    $('#fuel span').html(this.resources.fuel);
    $('#metals span').html(this.resources.metals);
};

GameEngine.prototype.sufficientResources = function (cost) {
    for(c in cost){
        if(this.resources[c] < cost[c]){
            return false;
        }
    }
    return true;
};

GameEngine.prototype.expendResources = function (cost) {
    for(c in cost){
        this.resources[c] -= cost[c];
        if(this.resources[c] < 0){
            this.resources[c] = 0;
        }
    }
};

GameEngine.prototype.updateResources = function () {
    var ship = sceneElements.mainShip.gameParameters;
    // regeneration
    if(this.autorepair && ship.health < ship.maxHealth){
        // ship needs repairs
        if(this.sufficientResources(ship.repairCost)){
            // ship can afford repairs
            this.expendResources(ship.repairCost);
            ship.health += ship.repairRate;
            if(ship.health > ship.maxHealth){
                ship.health = ship.maxHealth;
            }
        }
    }
    // recharge lasers
    var lasers = ship.weapons.lasers;
    if(lasers.currentCharge < lasers.maxCharge && this.timeouts.lasers === 0){
        // lasers need recharging
        if(this.resources.fuel >= lasers.rechargeCost){
            //if the player can afford to charge the banks
            // then refill
            this.resources.fuel -= lasers.rechargeCost;
            lasers.currentCharge += lasers.rechargeRate;
            if(lasers.currentCharge > lasers.maxCharge){
                lasers.currentCharge = lasers.maxCharge;
            }
        }
    }
    // recharge engines
    var engine = ship.engine;
    if(engine.currentCharge < 100){
        // recharge engines
        if(this.resources.fuel >= engine.rechargeCost){
            // player can afford to charge
            this.resources.fuel -= engine.rechargeCost;
            engine.currentCharge += engine.rechargeRate;
            if(engine.currentCharge > 100){
                engine.currentCharge = 100;
            }
        }
    }
    // eat food!
    if(this.timeouts.food === 0){
        if(this.resources.food > 0) {
            this.resources.food--;
        }
        else {
            ship.health--;
        }
        this.timeouts.food = EATING;
    }
    else{
        this.timeouts.food--;
    }
};

GameEngine.prototype.updateVitals = function () {

};

GameEngine.prototype.updateVitalSlot = function (which, numer, denom, percent) {
    $('#'+which+'bar').css('width', (100*numer/denom)+'%');
    if(percent === true){
        $('#'+which+'value').html(Math.round(100 * numer / denom) + '%');
    }
    else{
        $('#'+which+'value').html(numer+' / '+denom);
    }
};
GameEngine.prototype.updateVitalsInfo = function () {
    this.updateVitalSlot('health', sceneElements.mainShip.gameParameters.health, sceneElements.mainShip.gameParameters.maxHealth);
    this.updateVitalSlot('jump', sceneElements.mainShip.gameParameters.engine.currentCharge, 100, true);
    this.updateVitalSlot('laser', sceneElements.mainShip.gameParameters.weapons.lasers.currentCharge, sceneElements.mainShip.gameParameters.weapons.lasers.maxCharge);
};

GameEngine.prototype.laserHit = function(target, hit) {
    // trigger explosion
    graphicsEngine.addExplosionSmall(target.position.x + hit.where.x, target.position.y + hit.where.y, target.position.z + hit.where.z);
    // reset lasers
    hit.obj.hit = true;
    if(hit.obj.hasOwnProperty('damage') && target.hasOwnProperty('gameParameters') && target.gameParameters.hasOwnProperty('health')) {
        var damage = hit.obj.damage;
        if(target.gameParameters.health - damage < 0) {
            //alert("~~~~~~~DEATH~~~~~~~~");
            if(target === sceneElements.mainShip) {
                var killer = "an AI ship.";
                var victim;
				if(this.playerName) {
					victim = this.playerName;
				}
				else {
					victim = "Player " + this.nid;
				}
                sceneElements.netShips.forEach(function (ship) {
					if (ship.objectID==hit.obj.parentID) {
						if (hit.obj.parent.parentShip.gameParameters.pname) {
							killer = hit.obj.parent.parentShip.gameParameters.pname;
						}
						else {
							killer = "Player " + hit.obj.parent.parentShip.gameParameters.nid;
						}
					}
				});
                network.send({"sender":victim, "action":"broad", body:{"message":victim+" was killed by "+killer}});
                console.log(hit);
            }
            else if(sceneElements.AIShips.indexOf(target) !== -1) {
                this.kill(target);
            }
        }
        target.gameParameters.health -= hit.obj.damage;
    }
};

GameEngine.prototype.updateCollisions = function() {
    var colls;
    // collisions with main ship
    colls = collision(sceneElements.mainShip);
    // process
    for(var c in colls) {
        if(colls[c].obj.hasOwnProperty('fired')) {
            // hit by a laser!
            this.laserHit(sceneElements.mainShip, colls[c]);
        }
        else {
            console.log('hit by something else!!!');
            //graphicsEngine.gameplay_camera.quaternion.setFromEuler();
            graphicsEngine.gameplay_camera.translate(100);
            sceneElements.mainShip.gameParameters.health -= 200;
        }
    }
    // collisions with AI ships
    for(var s in sceneElements.AIShips) {
        colls = collision(sceneElements.AIShips[s]);
        // process
        for(var c in colls) {
            if(colls[c].obj.hasOwnProperty('fired')) {
                // hit by a laser!
                this.laserHit(sceneElements.AIShips[s], colls[c]);
            }
			else if(colls[c].obj === sceneElements.mainShip) {
				graphicsEngine.gameplay_camera.translateZ(10);
				var q = new THREE.Quaternion();
				q.setFromAxisAngle(graphicsEngine.gameplay_camera.up, -Math.PI/12);
				graphicsEngine.gameplay_camera.quaternion.multiplySelf(q);
				sceneElements.mainShip.gameParameters.health -= 500;
			}
        }
    }
    // collisions with net ships
    for(var s in sceneElements.netShips) {
        colls = collision(sceneElements.netShips[s]);
        // process
        for(var c in colls) {
            if(colls[c].obj.hasOwnProperty('fired')) {
                // hit by a laser!
                this.laserHit(sceneElements.netShips[s], colls[c]);
            }
        }
    }
    // collisions with asteroids and other environment objects
    for(var eo in sceneElements.env_objects) {
        if(!sceneElements.env_objects[eo].hasOwnProperty('children')) {
            continue;
        }
        for(var ec in sceneElements.env_objects[eo].children) {
            colls = collision(sceneElements.env_objects[eo].children[ec]);
            // process
            for(var c in colls) {
                if(colls[c].obj.hasOwnProperty('fired')) {
                    // hit by a laser!
                    this.laserHit(sceneElements.env_objects[eo].children[ec], colls[c]);
                }
				else if(colls[c].obj === sceneElements.mainShip) {
					console.log('asteroid bump');
					graphicsEngine.gameplay_camera.translateZ(10);
					var q = new THREE.Quaternion();
					q.setFromAxisAngle(graphicsEngine.gameplay_camera.up, -Math.PI/12);
					graphicsEngine.gameplay_camera.quaternion.multiplySelf(q);
					sceneElements.mainShip.gameParameters.health -= 500;
				}
            }
        }
    }
};

function round2(n) {
    n *= 100;
    n = Math.round(n);
    n /= 100;
    return n;
}

// GameEngine update function
// called each frame
GameEngine.prototype.update = function () {
    // transmit message to network
    if(this.playerMode === "multi" && network.ws.readyState === 1) {
        var message = {action:'pos', body:{}};
		// pid
		message.body.pid = this.planet;
        // net id
        message.body.nid = this.nid;
		// name
		message.body.pname = this.playerName;
        // health
        message.body.health = sceneElements.mainShip.gameParameters.health;
        // positon
        message.body.x = round2(sceneElements.mainShip.position.x);
        message.body.y = round2(sceneElements.mainShip.position.y);
        message.body.z = round2(sceneElements.mainShip.position.z);
        //message.body.x = round2(graphicsEngine.gameplay_camera.position.x);
        //message.body.y = round2(graphicsEngine.gameplay_camera.position.y);
        //message.body.z = round2(graphicsEngine.gameplay_camera.position.z);
        // rotation
        message.body.quat = {};
        message.body.quat.w = sceneElements.mainShip.quaternion.w;
        message.body.quat.x = sceneElements.mainShip.quaternion.x;
        message.body.quat.y = sceneElements.mainShip.quaternion.y;
        message.body.quat.z = sceneElements.mainShip.quaternion.z;
        // shooting
        if(this.firing) {
            message.body.firing = true;
            this.firing = false;
        }
        //console.log(JSON.stringify(message));
        network.send(message);
    }
    if(this.logicwait === 0) {
        //update things that don't need to be done strictly each frame

        // update resources
        this.updateResources();
        this.updateResourcesBar();

        // update vital stats
        this.updateVitalsInfo();

        // check if the player is dead
        if(sceneElements.mainShip.gameParameters.health <= 0){
            this.die();
            return;
        }

        // check if any network ships are invalid
        for(var ns in sceneElements.netShips) {
            if(sceneElements.netShips[ns].updated >= 5) {
                var rem = this.netShipsAdded.indexOf(sceneElements.netShips[ns].objectID);
                if(rem != -1) {
                    this.netShipsAdded.splice(rem, 1);
                }
                graphicsEngine.removeSceneObject(sceneElements.netShips[ns].objectID);
            }
            else{
                sceneElements.netShips[ns].updated++;
            }
        }

		// mining
		if(!this.miningTimeout) {
			this.miningTimeout = 2;
			if(this.miningStatus) {
				this.mine(this.miningTarget);
			}
			else {
				this.mineAsteroids();
			}
		}
		else {
			this.miningTimeout--;
		}

		// shoot weapon
		if(shooting) {
			this.fireWeapon();
		}

        if(this.playerMode === "single") {
            this.nextWave();
        }

        // decrement waits
        if(this.timeouts.lasers > 0){
            this.timeouts.lasers--;
        }

        // reset counter
        this.logicwait = 4;
    }
    else if(this.logicwait > 0) {
        this.logicwait--;
    }
    // check for collisions (every frame)
    this.updateCollisions();
};

// checks if the player is in range, then scans, then collects resources
GameEngine.prototype.mineAsteroids = function () {
	var min = null, dist = Infinity;
	for(var a in sceneElements.env_objects[0].children) {
		var xd = sceneElements.mainShip.position.x - sceneElements.env_objects[0].children[a].position.x,
			yd = sceneElements.mainShip.position.y - sceneElements.env_objects[0].children[a].position.y,
			zd = sceneElements.mainShip.position.z - sceneElements.env_objects[0].children[a].position.z;
	    var actualDistance = (xd * xd) + (yd * yd) + (zd * zd);
		// asteroid is in range and closer than all others [already checked]
		if(actualDistance <= this.miningRange && actualDistance < dist) {
			min = sceneElements.env_objects[0].children[a];
			dist = actualDistance;
		}
	}
	if(min) {
		this.mine(min);
	}
};

function scanvals(type) {
	var type = typeof type == "undefined" ? 0 : type;
	var weights = {food:20, fuel:30};
	switch(type) {
		case 1:
			weights = {food:50, fuel:10};
			break;
		case 2:
			weights = {food:10, fuel:60};
			break;
	}
	var vals = {};
	vals.food = Math.round(Math.random()*10 - 5) + weights.food;
	vals.fuel = Math.round(Math.random()*10 - 5) + weights.fuel;
	vals.metal = 100 - (vals.food + vals.fuel);
	return vals;
}


// Mine
// called upon user command
// Scans, then collects resources
GameEngine.prototype.mine = function (target) {
	var xd = sceneElements.mainShip.position.x - target.position.x,
		yd = sceneElements.mainShip.position.y - target.position.y,
		zd = sceneElements.mainShip.position.z - target.position.z;
	var actualDistance = (xd * xd) + (yd * yd) + (zd * zd);
	// if target is out of range
	if(actualDistance > this.miningRange) {
		this.miningStatus = 0;
		this.miningTarget = null;
		target.mineProg = 0;
		$('#miningprogress').hide();
		return;
	}
	// if not mining, start scanning
	if(this.miningStatus === 0) {
		this.miningStatus = 1;
		this.miningTarget = target;
		target.mineProg = 0;
		$('#miningbarinner').css('width', target.mineProg + '%');
		$('#miningaction div').html('Scanning...');
		$('#miningprogress').show();
	}
	// if scanning
	else if(this.miningStatus === 1) {
		target.mineWeights = scanvals(0);
		$('#miningfood div').html(target.mineWeights.food + '%');
		$('#miningfuel div').html(target.mineWeights.fuel + '%');
		$('#miningmetal div').html(target.mineWeights.metal + '%');
		target.mineProg++;
		// if done scanning
		if(target.mineProg >= 100) {
			target.mineProg = 0;
			this.miningStatus = 2;
			target.mineVals = {food:0, fuel:0, metal:0};
			$('#miningaction div').html('Mining Resources...');
		}
		$('#miningbarinner').css('width', target.mineProg + '%');
	}
	// if mining
	else if(this.miningStatus === 2) {
		this.resources.food += Math.round(target.mineWeights.food * Math.random());
		this.resources.fuel += Math.round(target.mineWeights.fuel * Math.random());
		this.resources.metals += Math.round(target.mineWeights.metal * Math.random());
		target.mineProg++;
		$('#miningbarinner').css('width', target.mineProg + '%');
		// if done mining
		if(target.mineProg >= 100) {
			target.mineProg = 0;
			this.miningStatus = 0;
			$('#miningaction div').html('Done.');
			$('#miningprogress').hide();
			this.miningTimeout = 20;
		}
	}
};

// Fire Weapon
// called upon user command
// checks if the selected weapon can be fired, then triggers weapons fire
GameEngine.prototype.fireWeapon = function () {
    if(this.timeouts.lasers === 0 && sceneElements.mainShip.gameParameters.weapons.lasers.currentCharge >= sceneElements.mainShip.gameParameters.weapons.lasers.fireCost) {
//        console.log("FFFFFFIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRRREEE " + sceneElements.mainShip.gameParameters.weapons.lasers.fireCost + '!!!!!');
        sceneElements.mainShip.fireLaser();
        sceneElements.mainShip.gameParameters.weapons.lasers.currentCharge -= sceneElements.mainShip.gameParameters.weapons.lasers.fireCost;
        this.timeouts.lasers = 3;
        this.firing = true;
    }
};

// Medium Jump
// called upon user command
// verifies that a jump can be made, then jumps forward
GameEngine.prototype.mediumJump = function () {
	if(sceneElements.mainShip.gameParameters.engine.currentCharge > sceneElements.mainShip.gameParameters.engine.medJumpCost) {
		console.log('med. jump success');
		graphicsEngine.gameplay_camera.translateZ(-5000);
		sceneElements.mainShip.gameParameters.engine.currentCharge -= sceneElements.mainShip.gameParameters.engine.medJumpCost;
	}
};

// Receive Network Update
// triggered when network module receives a position update
GameEngine.prototype.netUpdate = function (message) {
    try {
        // makes sure it's not the player's ship
		// but that is is the player's planet
        if(this.playerMode == "multi" && message.nid !== this.nid && message.pid == this.planet) {
            // go through each net ship
            var found = false;
            for(var ns in sceneElements.netShips) {
                if(sceneElements.netShips[ns].gameParameters.nid === message.nid) {
                    found = true;
                    // update the ship
                    sceneElements.netShips[ns].updated = 0;
                    sceneElements.netShips[ns].gameParameters.health = message.health;
                    sceneElements.netShips[ns].position.x = message.x;
                    sceneElements.netShips[ns].position.y = message.y;
                    sceneElements.netShips[ns].position.z = message.z;
                    sceneElements.netShips[ns].quaternion.w = message.quat.w;
                    sceneElements.netShips[ns].quaternion.x = message.quat.x;
                    sceneElements.netShips[ns].quaternion.y = message.quat.y;
                    sceneElements.netShips[ns].quaternion.z = message.quat.z;
                    if(message.hasOwnProperty('firing') && message.firing) {
                        sceneElements.netShips[ns].fireLaser();
                    }
                    if(message.hasOwnProperty('dead') && message.dead) {
                        this.kill(sceneElements.netShips[ns]);
                    }
                    if(message.hasOwnProperty('respawn') && message.respawn) {
                        var rem = this.netShipsAdded.indexOf(message.nid);
                        if(rem != -1) {
                            this.netShipsAdded.splice(rem, 1);
                        }
                    }
                    break;
                }
            }
            //if the ship was not found, create it
            if(!found && this.netShipsAdded.indexOf(message.nid) === -1) {
                var nets = $.extend(true, {}, netShip);
                nets.gameParameters.nid = message.nid;
                nets.gameParameters.pname = message.pname;
                nets.drawParameters.position.x = message.x;
                nets.drawParameters.position.y = message.y;
                nets.drawParameters.position.z = message.z;
                graphicsEngine.addGameObject(nets);
                this.netShipsAdded.push(message.nid);
            }
        }
    }
    catch (e) {
        
    }
};


        function cAdd(coords1, coords2){
            var coords = {};
            for(a in coords1){
                if(a != 'x' && a != 'y' && a != 'z'){
                    coords[a] = coords1[a];
                }
            }
            coords.x = (coords1.x + coords2.x);
            coords.y = (coords1.y + coords2.y);
            coords.z = (coords1.z + coords2.z);
            return coords;
        }
        function intersect(obj1, obj2){
            var xd = obj1.x - obj2.x,
                yd = obj1.y - obj2.y,
                zd = obj1.z - obj2.z,
                rr = obj1.r + obj2.r;
            var actualDistance = (xd * xd) + (yd * yd) + (zd * zd),
                minDistance = (rr * rr);
            if(actualDistance <= minDistance){
                // a hit!
                var hitLocation = new THREE.Vector3(xd, yd, zd);
                hitLocation.normalize();
                //console.log('obj1:'+obj1.x+'x'+obj1.y+'x'+obj1.z+'r'+obj1.r+' obj2:'+obj2.x+'x'+obj2.y+'x'+obj2.z+'r'+obj2.r+' hit:'+(hitLocation.x * obj2.r)+'x'+(hitLocation.y * obj2.r)+'x'+(hitLocation.z * obj2.r));
                return {x:(hitLocation.x * obj2.r), y:(hitLocation.y * obj2.r), z:(hitLocation.z * obj2.r)};
            }
            //console.log('obj1:'+obj1.x+'x'+obj1.y+'x'+obj1.z+'r'+obj1.r+' obj2:'+obj2.x+'x'+obj2.y+'x'+obj2.z+'r'+obj2.r+' miss');
            return false;
        }
        function collision(obj){
            var hits = [];
            var objects = [];
            objects.push(sceneElements.mainShip);
            //console.log(objects.length);
            //console.log(sceneElements.AIShips.length);
            objects = objects.concat(sceneElements.AIShips);
            //console.log(objects.length);
            for(var i in sceneElements.lasers) {
                objects = objects.concat(sceneElements.lasers[i].children);
                //console.log(objects.length);
            }
            if(sceneElements.hasOwnProperty('missiles')) {
                objects = objects.concat(sceneElements.missiles);
            }
            if(sceneElements.hasOwnProperty('netShips')) {
                objects = objects.concat(sceneElements.netShips);
            }
            if(sceneElements.hasOwnProperty('env_objects')) {
                for(var env in sceneElements.env_objects) {
                    if(sceneElements.env_objects[env].objectType == ASTEROID_FIELD) {
                        continue;
                    }
                    if(sceneElements.env_objects[env].hasOwnProperty('children')) {
                        objects = objects.concat(sceneElements.env_objects[env].children);
                    }
                }
            }
            //console.log(objects.length);
            // go through each object in the scene
            for(candidate in objects){
                // don't check against itself
                if((objects[candidate].hasOwnProperty('fired') && objects[candidate].fired && objects[candidate].parent.parentShip != obj) // it's an active laser
                        || (objects[candidate] !== obj && !objects[candidate].hasOwnProperty('fired'))){ // it's another object
                    //console.log('not me, not an unfired laser');
                    // check if there are spheres
                    var cspheres = undefined, ospheres = undefined;
                    if(typeof objects[candidate].spheres == "object") {
                        cspheres = objects[candidate].spheres;
                    }
                    else if(typeof objects[candidate].gameParameters == "object" && typeof objects[candidate].gameParameters.spheres == "object") {
                        cspheres = objects[candidate].gameParameters.spheres;
                    }
                    if(typeof obj.spheres == "object") {
                        ospheres = obj.spheres;
                    }
                    else if(typeof obj.gameParameters == "object" && typeof obj.gameParameters.spheres == "object") {
                        ospheres = obj.gameParameters.spheres;
                    }
                    if(typeof cspheres == "object" && typeof cspheres.outer == "object" && typeof ospheres == "object" && typeof ospheres.outer == "object"){
                        //console.log('spheres present');
                        // check outer.gameParameters.spheres
                        var crelative, ospheres, cfixed, ofixed;
                        crelative = cspheres.outer.hasOwnProperty('tposition') ? cspheres.outer.tposition : cspheres.outer;
                        orelative = ospheres.outer.hasOwnProperty('tposition') ? ospheres.outer.tposition : ospheres.outer;
                        cfixed = cspheres.hasOwnProperty('position') ? cspheres.position : objects[candidate].position;
                        ofixed = ospheres.hasOwnProperty('position') ? ospheres.position : obj.position;

                        if(cspheres.outer.hasOwnProperty('tposition')) {
                            cspheres.quaternion.multiplyVector3(cspheres.outer.position, crelative);
                        }
                        if(ospheres.outer.hasOwnProperty('tposition')) {
                            ospheres.quaternion.multiplyVector3(ospheres.outer.position, orelative);
                        }
//                        if(cspheres.hasOwnProperty('tposition')) {
//                            cspheres.quaternion.multiplyVector3(cfixed.position, cfixed); 
//                        }
//                        if(ospheres.hasOwnProperty('tposition')) {
//                            ospheres.quaternion.multiplyVector3(ofixed.position, ofixed); 
//                        }
                        var oHit = intersect(cAdd(crelative, cfixed), cAdd(orelative, ofixed));
                        //var oHit = intersect(cAdd(cspheres.outer, objects[candidate].position), cAdd(ospheres.outer, obj.position));
                        if(oHit){
                            //console.log('hit!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                            // check for inner.gameParameters.spheres
                            var check = false,
                                cand = [cspheres.outer],
                                subj = [ospheres.outer];
                            if(typeof cspheres.inner == "object" && cspheres.inner.length != 0){
                                check = true;
                                cand = cspheres.inner;
                            }
                            if(typeof ospheres.inner == "object" && ospheres.inner.length != 0){
                                check = true;
                                subj = ospheres.inner;
                            }
                            // check inner spheres
                            if(check){
                                for(c in cand){
                                    for(s in subj){
                                        crelative = cand[c].hasOwnProperty('tposition') ? cand[c].tposition : cand[c];
                                        orelative = subj[s].hasOwnProperty('tposition') ? subj[s].tposition : subj[s];
                                        if(cand[c].hasOwnProperty('tposition')) {
                                            cspheres.quaternion.multiplyVector3(cand[c].position, crelative);
                                        }
                                        if(subj[s].hasOwnProperty('tposition')) {
                                            ospheres.quaternion.multiplyVector3(subj[s].position, orelative);
                                        }
                                        var iHit = intersect(cAdd(crelative, cfixed), cAdd(orelative, ofixed));
                                        //var iHit = intersect(cAdd(cand[c], objects[candidate].position), cAdd(subj[s], obj.position));
                                        if(iHit){
                                            hits.push({where:iHit, obj:objects[candidate]});
                                        }
                                    }
                                }
                            }
                            // don't check innder spheres; mark as collision
                            else{
                                hits.push({where:oHit, obj:objects[candidate]});
                            }
                        }
                    }
                }
            }
            return hits;
        }
