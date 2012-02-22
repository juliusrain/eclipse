
//window resize events
$(window).load(sizeGame);
$(window).resize(sizeGame);

// keyboard events
$(window).keypress(function (e){
    //console.log(e);
    switch(e.keyCode){
        // j = toggle jump map
        case 106: {
            toggleJumpMap();
            break;
        }
        //l = bind/unbind cursor
        case 108: {
            toggleCursor();
            break;
        }
    }
});

function toggleJumpMap() {
    if($('#jumpmapbox:visible').length){
        $('#jumpmapbox').hide();
        graphicsEngine.toggleCursor();
    } else{
        $('#jumpmapbox').show();
        graphicsEngine.toggleCursor();
    }
}

function toggleCursor() {
    graphicsEngine.toggleCursor();
}