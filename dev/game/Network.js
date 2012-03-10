// Network Component

URL = "ws://cgi.cs.mcgill.ca:8080/~sli90/ws"

function Network() {
	//this part will hold the network connection
	this.ws = new WebSocket(URL);
}

Network.prototype.send = function (message) {
    this.ws.send(message)
}
