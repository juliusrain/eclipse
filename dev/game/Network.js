// Network Component

function Network() {
	//this part will hold the network connection
	this.ws;
}

Network.prototype.retrievePlanet = function (gid, ssid, pid) {
	var received = gameObjects;
	for(e in received){
		if(received[e].type === SKYBOX){
			for(var i = 0; i < 6; i++){
				received[e].parameters.textures[i] = "textures/" + received[e].parameters.textures[i];
				console.log(received[e].parameters.textures[i]);
			}
		}
	}
	return received;
}

Network.prototype.connect = function () {
    this.ws = new WebSocket(URL);
    // reconnect whenever connection drops
    var nw = this;
    this.ws.onclose = function () {
        nw.connect();
    }
}

Network.prototype.send = function (message) {
    // takes a JSON object and sends it to server as string
    this.ws.send(JSON.stringify(message))
}
