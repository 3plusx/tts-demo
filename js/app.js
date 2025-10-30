import { wrapSegments } from './helpers/utils.js';
import { handleReadButtonClick } from './helpers/interactions.js';
import { timer } from './helpers/timer.js';

$(document).foundation();

var baseUrl = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

// TODO: call player.js for each cobj with reading_audio and transcript_segments json data attr 
// and render audioplayer section with read aloud button
// add addEventlistener per each element

var audio_file = baseUrl + $('#read').data('audio-file');
var audio = new Audio(audio_file);
var segments_file = baseUrl + $('#read').data('timestamps-file');

audio.addEventListener('canplaythrough', function() {
  console.log("👌 Audio is ready to play from ",audio_file);
  var segments = '';
  $.getJSON(segments_file, function(data) {
      // segments has an array with a timestamps in start and end  
      segments = data.segments;
      console.log("👌 Read",segments.length,"segments from ", segments_file);
      wrapSegments(segments);
      console.log("👌 Segments wrapped.");
      handleReadButtonClick(audio, segments, () => timer(segments, audio, '#read'));
      console.log("👌 ReadButton handler set.");
  });
});
audio.addEventListener('error', function() {
  console.error("Error loading audio file ", audio_file);
});

