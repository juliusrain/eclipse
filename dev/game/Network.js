// Network Component

function Network() {
	//this part will hold the network connection
	this.ws=null;
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
    this.ws.onclose = function (evt) {
        nw.connect();
    }
    this.ws.onmessage = function (evt) {
        var parsed = JSON.parse(evt.data);
        var action = parsed.action;
        var sender = parsed.sender;
        var body = parsed.body;
        if (action == "chat") {
            nw.chat(sender, body);
        }
    }
}

Network.prototype.send = function (message) {
    // takes a JSON object and sends it to server as string
    this.ws.send(JSON.stringify(message));
}

Network.prototype.disconnect = function () {
    this.ws.onclose = null;
    this.ws.close();
}

Network.prototype.chat = function (sender, body) {
    var wrapped = '<div class="chatmessage">'+sender+' at <span>'+body.time+':</span><div>'+body.message+'</div></div>';
    var node = $(wrapped)
    node.hide();
    $("#chatmessages").append(node);
    node.slideDown(100, function (){$('#chatmessages').scrollTop($('#chatmessages').height()*1000)});
}
