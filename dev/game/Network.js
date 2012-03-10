// Network Component

function Network() {
	//this part will hold the network connection
	this.ws;
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
