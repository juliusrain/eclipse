// Network Component

URL = "ws://cgi.cs.mcgill.ca:8080/~sli90/ws"

function Network() {
	//this part will hold the network connection
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
    ws = new WebSocket
}
