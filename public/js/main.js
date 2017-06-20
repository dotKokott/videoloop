var $ = require("jquery");
var p5 = require("p5");
var TWEEN = require("TWEEN");

var RecordRTC = require('recordrtc');
var Whammy = RecordRTC.Whammy;
var WhammyRecorder = RecordRTC.WhammyRecorder;
var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;

var recordRTC;

function successCallback(stream) {
    // RecordRTC usage goes here

    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    recordRTC = RecordRTC(stream, options);
    recordRTC.startRecording();
}

function errorCallback(error) {
    // maybe another application is using the device
}

var mediaConstraints = { video: true, audio: true };

//navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
var stream;
navigator.mediaDevices.getUserMedia(mediaConstraints).then(function(result) { stream = result })

function init() {
    for(var i = 1; i < 10; i++) {
    	videos.push($('#' + i)[0]);
    }
}

$( document ).ready(function() {
    init();
});

var videos = [];
var currentVideo = 0;

function stopVideo() {
    recordRTC.stopRecording(function (audioVideoWebMURL) {
        videos[currentVideo].src = audioVideoWebMURL;
        videos[currentVideo].play();
        //var recordedBlob = recordRTC.getBlob();
        //recordRTC.getDataURL(function(dataURL) {
        	//video1.src = dataURL;
        	//console.log(video1);
        	//video1.play();
        //});
    });
}

var recording = false;

$(document).keydown(function(e) {
  if(recording) return;

  if (e.keyCode >= 96 && e.keyCode <= 105) {
  	for(var i = 0; i < 9; i++) {
  		videos[i].volume = 0.5;
  	}

  	recording = true;
  	console.log(stream);
    var key = e.keyCode - 97;
    console.log("Recording " + key);
    currentVideo = key;
    successCallback(stream);
  }


});

$(document).keyup(function(e) {
  if (e.keyCode >= 96 && e.keyCode <= 105) {
  	for(var i = 0; i < 9; i++) {
  		videos[i].volume = 1;
  	}
  	recording = false;
  	console.log('stop');
    stopVideo();
  }

  if(e.keyCode == 32) {
  	for(var i = 0; i < 8; i++) {
  		videos[i].pause();
  		$(videos[i]).fadeOut();
  	}

  	$(videos[8]).width('100%');
  	$(videos[8]).height('100%');
  }
});
