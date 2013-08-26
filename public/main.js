requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    jade: 'jade/runtime',
    jquery: 'jquery/jquery'
  }
});

require(['jquery'], function ($) {
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

  function onClick() {
    var width = $video.width();
    var height = $video[0].videoHeight / ($video[0].videoWidth/width);

    $video.attr('width', width);
    $video.attr('height', height);
    $canvas.attr('width', width);
    $canvas.attr('height', height);

    $canvas[0].getContext('2d').drawImage($video[0], 0, 0, width, height);
    var data = $canvas[0].toDataURL('image/png');
    $photo.attr('src', data);

    $video.removeAttr('width');
    $video.removeAttr('height');

  }

  function onStreamLoaded(stream) {
    stream = window.URL.createObjectURL(stream);
    $video[0].src = stream;
    $video[0].play();
    $video.click(onClick);
  }



  navigator.getMedia({ video: true }, onStreamLoaded, onErr);


});
