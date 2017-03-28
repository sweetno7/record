function init(folder,key) {
    soundReadFile(folder,key);
}
function soundOnload() {

}
function soundReadFile(folder, key) {
    var folder_name = folder+key;
    var i;
    $.getJSON('config/audio.list.json', function (data) {

        //var sound_items = ;
        for (i = 0; i < data[key].length; i++) {
            $("#showaudio").append('<audio class="text-center" id="sound_' + data[key][i] + '"><source src="media/audio/' + folder_name + '/' + data[key][i] + '" type="audio/mp3"/></audio>')
        }

    });
}

function recordSound(folder, file, image) {

    $("#showaudio").html('<audio class="embed-responsive-item  text-center" id="active-sound"><source src="media/audio/' + folder + '/' + file + '.mp3" type="audio/mp3"/></audio>');
    $('#show-image-record').html('<img src="images/vowels1/' + image + '.png" >')
}
function playRepeatSound() {
    var s = document.getElementById('active-sound');
    s.play();
}
function playSound(file) {
    var s = document.getElementById('sound_' + file+'.mp3');
    s.play();

}
function setActiveSound(folder, file) {
    $("#show-acitve-audio").html('<audio  id="active-sound"><source src="media/audio/' + folder + '/' + file + '.mp3" type="audio/mp3"/></audio>')
}
