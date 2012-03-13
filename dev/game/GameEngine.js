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

    // start network client
    network = new Network();

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
        this.resources.food--;
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

// GameEngine update function
// called each frame
GameEngine.prototype.update = function () {
    //console.log(sceneElements.mainShip.position.x+":"+sceneElements.mainShip.position.y+":"+sceneElements.mainShip.position.z);
    if(this.logicwait === 0) {
        //update things that don't need to be done strictly each frame

        // update resources
        this.updateResources();
        this.updateResourcesBar();

        // update vital stats
        this.updateVitalsInfo();

        // decrement waits
        if(this.timeouts.lasers > 0){
            this.timeouts.lasers--;
        }

        // reset counter
        this.logicwait = 4;
    }
    else {
        this.logicwait--;
    }
};

// Fire Weapon
// called upon user command
// checks if the selected weapon can be fired, then triggers weapons fire
GameEngine.prototype.fireWeapon = function () {
    if(this.timeouts.lasers === 0 && sceneElements.mainShip.gameParameters.weapons.lasers.currentCharge >= sceneElements.mainShip.gameParameters.weapons.lasers.fireCost) {
        console.log("FFFFFFIIIIIIIIIIIIIIIRRRRRRRRRRRRRRRRREEE " + sceneElements.mainShip.gameParameters.weapons.lasers.fireCost + '!!!!!');
        sceneElements.mainShip.fireLaser();
        sceneElements.mainShip.gameParameters.weapons.lasers.currentCharge -= sceneElements.mainShip.gameParameters.weapons.lasers.fireCost;
        this.timeouts.lasers = 3;
    }
};
