
var chatfocus = false;
var shooting = false;

// window resize events
$(window).load(sizeGame);
$(window).resize(sizeGame);

// click events
$('#jumpmapcontrol').click(toggleJumpMap);
$('#mouselockcontrol').click(toggleCursor);
$('#chatcontrol').click(switchToChat);
$('#chatcompose').focus(function (){
    $('#chatcontrol span').html('Esc');
    $('#chatcontrol').addClass('on');
    chatfocus = true;
});
$('#chatcompose').blur(function (){
    console.log('leave them kids alone!');
    //document.getElementById('chatcompose').blur();
    $('#chatcontrol span').html('Ent');
    $('#chatcontrol').removeClass('on');
    chatfocus = false;
});

// keyboard events
$(window).keypress(function (e){
    //console.log(e);
    if(!chatfocus) {
        switch(e.keyCode){
            // j = toggle jump map
            case 106: {
                toggleJumpMap();
                break;
            }
            // l = bind/unbind cursor
            case 108: {
                if(!$('#jumpamapbox:visible').length) {
                    toggleCursor();
                } 
                break;
            }
            /*
            // space = fire weapon
            case 32: {
                gameEngine.fireWeapon();
                break;
            }
            */
            // t = auto repair
            case 116:{
                toggleAutoRepair();
                break;
            }
            // enter = chat box
            case 13: {
                $('#chatcompose').focus();
                return false;
                break;
            }
            //create explosion (for testing) p
            case 112: {
                //graphicsEngine.addExplosionLarge(50, 0, -100);
                sceneElements.AIShips[0].fireLaser();
                break;
            }
            case 111: {
                var new_ship = jQuery.extend(true, {}, ship_template);
                console.log(new_ship);
                //graphicsEngine.addGameObject(new_ship);
                break;
            }
        }
    }
});
$(window).keydown(function (e){
    if(!chatfocus) {
        if(e.keyCode === 32) {
            shooting = true;
            return false;
        }
    }
});
$(window).keyup(function (e){
    if(!chatfocus) {
        if(e.keyCode === 32) {
            shooting = false;
            return false;
        }
    }
});

$('#chatcompose').keydown(function (e){
    //console.log(e);
    var chatbox=$("#chatcompose");
    if (e.which == 27) {
        // if user pressed esc, leave chat mode
        $('#chatcompose').blur();
    }
    else if (e.which == 13) {
        // if user pressed answer, send new msg and leave chat mode
        $('#chatcompose').blur();
        if(chatbox.val() != "") {
            newMessage(chatbox.val());
            chatbox.val("");
        }
        console.log("teacher!");
    } else {
        // stop propagation of event so it doesn't affect ship steering
        e.stopImmediatePropagation();
    }
});

function toggleJumpMap() {
    // hide jump map
    if($('#jumpmapbox:visible').length){
        $('#jumpmapbox').hide();
        graphicsEngine.toggleCursor(false);
        graphicsEngine.jumpmap.setVisible(false);
        $('#jumpmapcontrol').removeClass('on');
    } else { // show jump map
        $('#jumpmapbox').show();
        graphicsEngine.toggleCursor(true);
        graphicsEngine.jumpmap.setVisible(true);
        $('#jumpmapcontrol').addClass('on');
    }
}

function toggleAutoRepair() {
    if($('#autorepaircontrol').hasClass("on")){
        // auto repair is now off, turn it on
        gameEngine.autorepair = true;
        $('#autorepaircontrol').removeClass('on');
    } else{
        // auto repair is now on, turn it off
    gameEngine.autorepair = false;
        $('#autorepaircontrol').addClass('on');
    }
}

function toggleCursor() {
    graphicsEngine.toggleCursor();
    if($('#mouselockcontrol').hasClass("on")){
        $('#mouselockcontrol').removeClass('on');
        $('body').css('cursor', 'crosshair');
    }
    else{
        $('#mouselockcontrol').addClass('on');
        $('body').css('cursor', 'auto');
    }
}

function switchToChat() {
    console.log('chat?');
    if(chatfocus){
        $('#chatcompose').blur();
    }
    else{
        $('#chatcompose').focus();
    }
}
