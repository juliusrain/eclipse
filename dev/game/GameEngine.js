// Game Engine
function GameEngine() {
	this.gameID;// = <?php echo $number; ?>;//get from game maker?
	this.solarSystem;
	this.planet;
	this.resources = {};//load from game constants!
	this.stage = 0;
	// new game portion - NO NEED FOR THIS!
	   // call database, create new game(?)
	   // call database, retrieve types info, generate solar systems/planets
    // create graphicsEngine
	this.load(this.solarSystem, this.planet);
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
GameEngine.prototype.load = function (ssid, pid){
	// wipe everything
	//     *********clear
	//     place loader screen
	// determine winning or losing state
	//     blah blah blah
    this.solarSystem = ssid;
    this.planet = pid;
	// get information from network
	var received = network.retrievePlanet(this.gameID, this.solarSystem, this.planet);
    graphicsEngine.loadGamePlayObjects(received);
	// trigger GraphicsEngine
    graphicsEngine.startEngine();
    // remove loader screen
};

// GameEngine update function
// called each frame
GameEngine.prototype.update = function (){

};


