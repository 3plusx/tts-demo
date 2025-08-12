$(document).foundation();


var audio = new Audio('/assets/haa_test_thorsten_tacotron2_ddc.mp3');
var segments_file = '/assets/haa_test_thorsten_tacotron2_ddc.json';
// read json and store in var text
var segments = '';
$.getJSON(segments_file, function(data) {
    console.log("text data", data.text);
    segments = data.segments;
    console.log("text", segments);

    wrapSegments(segments);
    



});
// segments has an array with a timestamps in start and end  

// STEPS
// Wrap every segment in a <span> with a class:
wrapSegments = function(segments) {
  var readings = $('.readings');
  $('.readings p').each(function() {
    // find every phrase by a point or question mark and wrap it in a span with class 'segment'
    var html = $(this).html();
    var index = 0;
    html = html.replace(/([^?.!]+[?.!])/g, function(match) {
      var randomOffset = Math.floor(Math.random() * 40) - 20; // random number between -20 and +20
      var backgroundColor = `rgb(240, 240, ${225+randomOffset})`; // random opacity between 0.1 and 1
      var backgroundColor = '';
      console.log("backgroundColor", backgroundColor);
      return `<span class="segment segment-${index++}" data-segment="${index}" style="background-color: ${backgroundColor}">${match.trim()}</span>`;
    });
    $(this).html(html);
  });
};

// Add a click handler to each segment that plays the audio from the start of the segment to the end of the segment


// Highlight the current segment while it is playing  
var zeitstempelNachrichten = [];
for (let i = 0; i < segments.length; i++) {
  zeitstempelNachrichten[i] = `Segment ${i + 1}: ${segments[i].start} bis ${segments[i].end}`;
}     


function timerMitLogOutput() {
  console.log("prepare intervall");
  const startTime = Date.now(); // Startzeitpunkt in Millisekunden
 
  var currentSegment = document.querySelector('.segment-0');
  if (currentSegment) {
    currentSegment.classList.add('current');
  }
  var index = 0;
  const intervalId = setInterval(() => {
    
    const currentTime = Date.now();
    const runTime = Math.floor((currentTime - startTime) / 1000);
    console.log("intervall läuft...",runTime);
    console.log("segments[index]", segments[index].end);
    if ( runTime >= segments[index].end ) {
      var currentSegment = document.querySelector('.segment-'+index);
      currentSegment.classList.remove('current');
      index++;
      console.log("Next segment", index);
      var nextSegment = document.querySelector('.segment-' + index);
      if (nextSegment) {
        nextSegment.classList.add('current');
      }
    }
    currentSegment = nextSegment;
    if (runTime >= 30) {
      clearInterval(intervalId);
    }
    var status = $('#read').data('status');
    console.log("status", status);
    if (status === 'paused' || status === 'finished') {
      console.log("stop timer");
      clearInterval(intervalId);
      return;
    }
    // TODO: stop mechanism if button is pressed!



  }, 1000); // 1 Sekunde
}


$('#read').on('click', function() {
  console.log("show class of #read", $(this).attr('class'));

  if ( $(this).hasClass('playing') ) {
    console.log($(this))
    $('#read-ready').hide();
    $('#read-play').hide();
    $('#read-stop').show();
    $(this).removeClass('playing');
    $('.readings').removeClass('while_playing');
    $('#read').data('status', 'paused');
    $('#read').data('playtime', 0);
    // stop audio:
    audio.currentTime = 0;
    audio.pause();
    var allSegments = document.querySelectorAll('.segment');
    allSegments.forEach(function(segment) {
      segment.classList.remove('current');
    });
    console.log("audio ended");    
  } else {
    console.log('playing audio');
    $('#read').data('status', 'playing');
    $('#read-ready').hide();
    $('#read-play').show();
    $('#read-stop').hide();
    $(this).addClass('playing');
    $('.readings').addClass('while_playing');

    audio.play();
    timerMitLogOutput();
    audio.onended = function() {
      $('#read-ready').show();
      $('#read-play').hide();
      $('#read-stop').hide();
      $('#read').removeClass('playing');
      $('.readings').removeClass('while_playing');
      $('#read').data('status', 'finished');
      var allSegments = document.querySelectorAll('.segment');
      allSegments.forEach(function(segment) {
        segment.classList.remove('current');
      });
      console.log("audio ended");
    };
  }
});

