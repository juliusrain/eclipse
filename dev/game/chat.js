$(document).ready(function () {
    $("#chatcompose").live("keypress", function(e) {
        if (e.keyCode == 13) {
            $(this).select();
        }
    });
});

newMessage = function(form) {
    console.log(form[0]);
}
