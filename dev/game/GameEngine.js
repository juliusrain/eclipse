// Game Engine
function GameEngine() {
    this.gameID = 0;// = <?php echo $number; ?>;//get from game maker?
    this.solarSystem = 0;
    this.planet = 0;
    //this.resources = {};//load from game constants!
    // TEMPORARY ***************************************
    this.resources = {
        food:1000,
        fuel:1000,
        metals:1000,
    };
    this.stage = 0;
    this.logicwait = 0;

	// start network client
	network = new Network();

    // new game portion - NO NEED FOR THIS!
       // call database, create new game(?)
       // call database, retrieve types info, generate solar systems/planets
    // create graphicsEngine
    graphicsEngine = new GraphicsEngine();
    this.load(this.solarSystem, this.planet);
    //graphicsEngine.loadGameplayObjects(gameObjects);
}

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
    //graphicsEngine.startEngine();
    // remove loader screen
	$('#loader').hide();
};

GameEngine.prototype.updateResourcesBar = function () {
    $('#food span').html(this.resources.food);
    $('#fuel span').html(this.resources.fuel);
    $('#metals span').html(this.resources.metals);
};

GameEngine.prototype.updateResources = function () {

};

GameEngine.prototype.updateVitals = function () {

};

GameEngine.prototype.updateVitalSlot = function (which, numer, denom) {
    $('#'+which+'bar').css('width', (100*numer/denom)+'%');
    $('#'+which+'value').html(numer+' / '+denom);
};
GameEngine.prototype.updateVitalsInfo = function () {
    this.updateVitalSlot('health', sceneElements.mainShip.gameParameters.health, sceneElements.mainShip.gameParameters.maxhealth);
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

        // reset counter
        this.logicwait = 4;
    }
    else {
        this.logicwait--;
    }
};


