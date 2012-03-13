newMessage = function(message) {
    var date = new Date();
    var time = date.toLocaleTimeString();
    var json = {
        "action": "chat",
        "sender": "name",
        "body": {
            "time": time,
            "message": message,
        },
    }
    network.send(json);
    $('#chatmessages').scrollTop($('#chatmessages').height()*1000);
    console.log("message sent")
}

