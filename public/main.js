requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    jade: 'jade/runtime',
    jquery: 'jquery/jquery',
    animatedGif: 'Animated_GIF/src/Animated_GIF',
    omggif: 'Animated_GIF/src/omggif',
    neuquant: 'Animated_GIF/src/NeuQuant'
  }
});

require(['jquery', 'animatedGif'], function ($, AnimatedGif) {
  var $tile = $('.tile');
  var $video = $('video.recorder');
  var $canvas = $('.canvas');
  var $videoInput = $('.video-input');
  var $photo = $('.photo');

  navigator.getMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

  function onErr(err) {
    $video.hide();
    $videoInput.show();
    if (err.PERMISSION_DENIED) {
      console.err('Looks like you denied us permission to use your camera :(');
    } else if (err.NOT_SUPPORTED) {
      // It's fine, just show the videoInput
    }
  }

  var width;
  var height;
  var frames = [];

  var count = 0;
  var COUNT = 5;
  var DELAY = 200;
  var interval;

  function makeGif() {
    var ag = new Animated_GIF({ workerPath: '/bower_components/Animated_GIF/src/quantizer.js' });
    ag.setSize(320, 240);
    ag.setDelay(10);
    for (var i=0; i<frames.length; i++) {
      ag.addFrame(frames[i]);
    }
    var animatedImage = document.createElement('img');
    ag.getBase64GIF(function(image) {
      animatedImage.src = image;
      $photo.append(animatedImage);
    });
  }

  function snapPicture() {
    console.log("SNAP");
    var data;
    $canvas[0].getContext('2d').drawImage($video[0], 0, 0, width, height);
    var img = document.createElement('img');
    img.src = $canvas[0].toDataURL('image/gif');
    frames.push(img);
    count++;
    if ( count === COUNT ) {
      clearInterval(interval);
      makeGif();
    }
  }

  function onClick() {
    width = $video.width();
    height = $video[0].videoHeight / ($video[0].videoWidth / width);

    $video.attr('width', width);
    $video.attr('height', height);
    $canvas.attr('width', width);
    $canvas.attr('height', height);

    interval = setInterval(snapPicture, DELAY);

    $video.removeAttr('width');
    $video.removeAttr('height');

  }

  function onStreamLoaded(stream) {
    stream = window.URL.createObjectURL(stream);
    $video[0].src = stream;
    $video[0].play();
    $video.click(onClick);
  }

  navigator.getMedia({
    video: true
  }, onStreamLoaded, onErr);

});
