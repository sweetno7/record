function restore() {
    $("#record, #live").removeClass("disabled");
    $("#pause").replaceWith('<a class="button one" id="pause">Pause</a>');
    $(".one").addClass("disabled");
    Fr.voice.stop();
}

function makeWaveform() {
    var analyser = Fr.voice.recorder.analyser;

    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    /**
     * The Waveform canvas
     */
    var WIDTH = 400,
            HEIGHT = 100;

    var canvasCtx = $("#level")[0].getContext("2d");
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {
        var drawVisual = requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }
        canvasCtx.lineTo(WIDTH, HEIGHT / 2);
        canvasCtx.stroke();
    }
    ;
    draw();
}
function btnStop() {
    $('#btn-stop').removeClass('btn-danger');
    $('#btn-stop').addClass('btn-primary');
    $('#btn-stop').html('<i class="fa fa-microphone" aria-hidden="true"></i> Record');
//        $('#record').removeAttr('id');
    $('#btn-stop').attr('id', 'record');
    Fr.voice.export(function (url) {
        $("#audio").attr("src", url);
        $("#audio")[0].play();
    }, "URL");
    Fr.voice.export(function (url) {
        $("#sound-download").html("<a href='" + url + "' download='MyRecording.wav'></a>");

    }, "URL");

}
function btnSave() {
    $('#download').attr('id', 'btn-save');
}
$(document).ready(function () {
    $(document).on("click", "#btn-stop", function () {
        btnStop()
        Fr.voice.export(function (url) {
            $("#sound-download").html("<a href='" + url + "' download='MyRecording.wav'></a>");

        }, "URL");
        //btnSave();
        Fr.voice.stop()


    });
    $(document).on("click", "#record:not(.disabled)", function () {
        $('#record').removeClass('btn-primary');
        $('#record').addClass('btn-danger');
        $('#record').html('<i class="fa fa-stop-circle-o" aria-hidden="true"></i> Stop');
//        $('#record').removeAttr('id');
        $('#record').attr('id', 'btn-stop');

        Fr.voice.record($("#live").is(":checked"), function () {
            $(".recordButton").addClass("disabled");

            $("#live").addClass("disabled");
            $(".one").removeClass("disabled");
            makeWaveform();

        });
    });

    $(document).on("click", "#recordFor5:not(.disabled)", function () {
        Fr.voice.record($("#live").is(":checked"), function () {
            $(".recordButton").addClass("disabled");

            $("#live").addClass("disabled");
            $(".one").removeClass("disabled");

            makeWaveform();
        });

        Fr.voice.stopRecordingAfter(5000, function () {
            alert("Recording stopped after 5 seconds");
        });
    });

    $(document).on("click", "#pause:not(.disabled)", function () {
        if ($(this).hasClass("resume")) {
            Fr.voice.resume();
            $(this).replaceWith('<a class="button one" id="pause">Pause</a>');
        } else {
            Fr.voice.pause();
            $(this).replaceWith('<a class="button one resume" id="pause">Resume</a>');
        }
    });

    $(document).on("click", "#stop:not(.disabled)", function () {
        restore();
    });

    $(document).on("click", "#play:not(.disabled)", function () {

        if ($(this).parent().data("type") === "mp3") {
            Fr.voice.exportMP3(function (url) {
                $("#audio").attr("src", url);
                $("#audio")[0].play();
            }, "URL");
        } else {
            Fr.voice.export(function (url) {
                if (url) {
                    $("#audio")[0].play();
                } else {
                    $("#audio").attr("src", url);
                    $("#audio")[0].play();
                }

            }, "URL");
            Fr.voice.export(function (url) {
                $("#sound-download").html("<a href='" + url + "' download='MyRecording.wav'></a>");

            }, "URL");
            btnStop();
            btnSave();

        }
        restore();
        $('#sound-save').removeClass('disabled');
    });
    $(document).on("click", "#sound-save:not(.disabled)", function () {
        $("#sound-download > a")[0].click();
        btnStop()
    });

    $(document).on("click", "#download:not(.disabled)", function () {
        if ($(this).parent().data("type") === "mp3") {
            Fr.voice.exportMP3(function (url) {
                $("<a href='" + url + "' download='MyRecording.mp3'></a>")[0].click();
            }, "URL");
        } else {
            Fr.voice.export(function (url) {
                $("<a href='" + url + "' download='MyRecording.wav'></a>")[0].click();
            }, "URL");
        }

        btnStop();
        restore();
    });

    $(document).on("click", "#base64:not(.disabled)", function () {
        if ($(this).parent().data("type") === "mp3") {
            Fr.voice.exportMP3(function (url) {
                console.log("Here is the base64 URL : " + url);
                alert("Check the web console for the URL");

                $("<a href='" + url + "' target='_blank'></a>")[0].click();
            }, "base64");
        } else {
            Fr.voice.export(function (url) {
                console.log("Here is the base64 URL : " + url);
                alert("Check the web console for the URL");

                $("<a href='" + url + "' target='_blank'></a>")[0].click();
            }, "base64");
        }
        restore();
    });

    $(document).on("click", "#save:not(.disabled)", function () {
        function upload(blob) {
            var formData = new FormData();
            formData.append('file', blob);

            $.ajax({
                url: "upload.php",
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (url) {
                    $("#audio").attr("src", url);
                    $("#audio")[0].play();
                    alert("Saved In Server. See audio element's src for URL");
                }
            });
        }
        if ($(this).parent().data("type") === "mp3") {
            Fr.voice.exportMP3(upload, "blob");
        } else {
            Fr.voice.export(upload, "blob");
        }
        restore();
    });
});
