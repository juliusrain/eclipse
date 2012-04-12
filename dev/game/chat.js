newMessage = function(message) {
    var date = new Date();
    var time = date.toLocaleTimeString();
	var name = "player";
	if(typeof gameEngine == "object")
		if(gameEngine.hasOwnProperty('playerName') && gameEngine.playerName) {
			name = gameEngine.playerName;
		}
		else if(gameEngine.hasOwnProperty('nid')) {
			name += gameEngine.nid;
		}
	}
    var json = {
        "action": "chat",
        "sender": gameEngine.playerName,
        "body": {
            "time": time,
            "message": message,
        },
    }
    network.send(json);
    $('#chatmessages').scrollTop($('#chatmessages').height()*1000);
    console.log("message sent")
}

