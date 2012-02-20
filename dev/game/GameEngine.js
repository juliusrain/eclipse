// Game Engine
function GameEngine() {
	this.gameID;//get from game maker?
	this.solarSystem;
	this.planet;
	this.resources = {};//load from game constants!
	this.stage = 0;
	// new game portion - NO NEED FOR THIS!
	   // call database, create new game(?)
	   // call database, retrieve types info, generate solar systems/planets
	this.load();
}

//Jump function
GameEngine.prototype.jump = function (ssid, pid){
	this.solarSystem = ssid;
	this.planet = pid;
	this.save();
	this.load();
};

// GameEngine save function
// called prior to jumping to another planet
GameEngine.prototype.save = function () {

};

// GameEngine load function
// called when jumping into another system
GameEngine.prototype.load = function (){
	// wipe everything
	//     *********clear
	//     place loader screen
	// get information from network
	var received = network.retrievePlanet(this.gameID, this.solarSystem, this.planet);
	// trigger GraphicsEngine

};

// GameEngine update function
// called each frame
GameEngine.prototype.update = function (){

};


