// Network Component

function Network() {
    //this part will hold the network connection
    this.ws=null;
}

Network.prototype.retrievePlanet = function (gid, ssid, pid) {
    var received = [];
//    var box = $.extend(true, {}, skybox);
    var box;

    switch(pid) {
        case GAS_GIANT: {
            box = $.extend(true, {}, skybox_gas);
            break;
        }
        case ROCK_PLANET: {
            box = $.extend(true, {}, skybox_rock);
            break;
        }
    }

    if(gameEngine.playerMode === "multi") {
        for(var i = 0; i < 6; i++){
            box.parameters.textures[i] = "textures/" + box.parameters.textures[i];
        }
        received.push(box);
        received.push(playerShip);
        received.push(asteroid_field);
        return received;
    }
    received = gameObjects;
    for(e in received){
        if(received[e].type === SKYBOX){
            for(var i = 0; i < 6; i++){
                received[e].parameters.textures[i] = "textures/" + received[e].parameters.textures[i];
            }
        }
        else if(received[e].type === AI_SHIP) {
            received[e].drawParameters.position.x = Math.random() * 1000 - 500;
            received[e].drawParameters.position.y = Math.random() * 1000 - 500;
            received[e].drawParameters.position.z = Math.random() * 1000 - 500;
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
            nw.displayChat(sender, body);
        } else if (action == "pos") {
            gameEngine.netUpdate(body);
        } else if (action == "broad") {
            nw.broadcast(body);
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

Network.prototype.displayChat = function (sender, body) {
    var wrapped = '<div class="chatmessage">'+sender+' at <span>'+body.time+':</span><div>'+body.message+'</div></div>';
    var node = $(wrapped)
    node.hide();
    $("#chatmessages").append(node);
    node.slideDown(100, function (){$('#chatmessages').scrollTop($('#chatmessages').height()*1000)});
}

Network.prototype.broadcast = function (body) {
    var broadcastBox = $("#broadcastBox");
    var node = $("<div>");
    node.text(body.message);
    broadcastBox.append(node);
    node.fadeOut(2000, function () {
        node.remove()
    });
}
