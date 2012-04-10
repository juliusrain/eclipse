// Game Engine
function GameEngine() {
    this.gameID = 0;// = <?php echo $number; ?>;//get from game maker?
    this.solarSystem = 0;
    this.planet = 0;
    //this.resources = {};//load from game constants!
    // TEMPORARY ***************************************
    this.resources = {
        food:10000,
        fuel:10000,
        metals:10000,
    };
    this.stage = 0;
    this.autorepair = true;
    this.timeouts = {
        lasers:0,
        food:0,
    };
    this.logicwait = 0;

    this.nid = Math.floor(Math.random() * 99999);

    ai = new AI();

    //start network client
    network = new Network();
    network.connect();
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
    var glow = false;
    graphicsEngine = new GraphicsEngine(glow);
    this.load(this.solarSystem, this.planet);
};

// Death Clause for Player Ship
GameEngine.prototype.die = function (){
    sceneElements.mainShip.gameParameters.health = 0;
    this.logicwait = -1;
    // transmit message to network
    if(network.ws.readyState === 1) {
        var message = {action:'pos', body:{}};
        // net id
        message.body.nid = this.nid;
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
//    alert("YOU HAVE DIED.");
};

// Death Clause for AI Ships
GameEngine.prototype.kill = function (victim){
    victim.gameParameters.health = 0;
    graphicsEngine.addExplosionLarge(victim.position.x, victim.position.y, victim.position.z);
    graphicsEngine.removeSceneObject(victim.objectID);
};


//Jump function
GameEngine.prototype.jump = function (ssid, pid){
    this.solarSystem = ssid;
    this.planet = pid;
    graphicsEngine.stopEngine();
    this.save();
    graphicsEngine.deleteScene();
    this.load(ssid, pid);
    // etc
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
    $('#loader').show();
    // determine winning or losing state
    //     blah blah blah

    // get information from network
    var received = network.retrievePlanet(this.gameID, ssid, pid);
    graphicsEngine.loadGameplayObjects(received);
    this.solarSystem = ssid;
    this.planet = pid;

    // trigger GraphicsEngine
    graphicsEngine.startEngine();
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
        target.gameParameters.health -= hit.obj.damage;
        if(target.gameParameters.health < 0) {
            //alert("~~~~~~~DEATH~~~~~~~~");
            if(target === sceneElements.mainShip) {
                this.die();
            }
            else if(sceneElements.AIShips.indexOf(target) !== -1) {
                this.kill(target);
            }
        }
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
    if(network.ws.readyState === 1) {
        var message = {action:'pos', body:{}};
        // net id
        message.body.nid = this.nid;
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
                graphicsEngine.removeSceneObject(sceneElements.netShips[ns].objectID);
            }
            else{
                sceneElements.netShips[ns].updated++;
            }
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

// Receive Network Update
// triggered when network module receives a position update
GameEngine.prototype.netUpdate = function (message) {
    try {
        // makes sure it's not the player's ship
        if(message.nid !== this.nid) {
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
                    break;
                }
            }
            //if the ship was not found, create it
            if(!found && this.netShipsAdded.indexOf(message.nid) === -1) {
                var nets = $.extend(true, {}, netShip);
                nets.gameParameters.nid = message.nid;
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
                        cfixed = cspheres.hasOwnProperty('tposition') ? cspheres.tposition : objects[candidate].position;
                        ofixed = ospheres.hasOwnProperty('tposition') ? ospheres.tposition : ofixed = obj.position;

                        if(cspheres.outer.hasOwnProperty('tposition')) {
                            if(cspheres.useQuaternion == true) {
                                cspheres.quaternion.multiplyVector3(cspheres.outer.position, cspheres.outer.tposition);
                            } else {

                            }
                        }
                        if(ospheres.outer.hasOwnProperty('tposition')) {
                            if(ospheres.useQuaternion == true) {
                                ospheres.quaternion.multiplyVector3(ospheres.outer.position, ospheres.outer.tposition);
                            } else {

                            }
                        }
                        if(cspheres.hasOwnProperty('tposition')) {
                                cfixed.quaternion.multiplyVector3(cfixed.position, cfixed.tposition); 
                        }
                        if(ospheres.hasOwnProperty('tposition')) {
                                ofixed.quaternion.multiplyVector3(ofixed.position, ofixed.tposition); 
                        }
                        var oHit = intersect(cAdd(crelative, cfixed), cAdd(orelative, ofixed));
                        //var oHit = intersect(cAdd(cspheres.outer, objects[candidate].position), cAdd(ospheres.outer, obj.position));
                        if(oHit){
                            console.log('hit!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
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
                                console.log("made it inside");
                                for(c in cand){
                                    for(s in subj){
                                        crelative = cand[c].hasOwnProperty('tposition') ? cand[c].tposition : cand[c];
                                        orelative = subj[s].hasOwnProperty('tposition') ? subj[s].tposition : subj[s];
                                        if(cand[c].hasOwnProperty('tposition')) {
                                            cspheres.quaternion.multiplyVector3(cand[c].position, cand[c].tposition);
                                        }
                                        if(subj[s].hasOwnProperty('tposition')) {
                                            ospheres.quaternion.multiplyVector3(subj[s].position, subj[s].tposition);
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
