$(document).foundation();


var audio = new Audio('/assets/haa_test_thorsten_tacotron2_ddc.mp3');



$('#read').on('click', function() {
  console.log("show class of this", $(this).attr('class'));

  if ( $(this).hasClass('playing') ) {
    console.log($(this))
    $('#read-ready').hide();
    $('#read-play').hide();
    $('#read-stop').show();
    $(this).removeClass('playing');

    // stop audio:
    audio.currentTime = 0;
    audio.pause();
  } else {
    console.log('start to play')
    $('#read-ready').hide();
    $('#read-play').show();
    $('#read-stop').hide();
    $(this).addClass('playing');

    audio.play();
    audio.onended = function() {
      $('#read-ready').show();
      $('#read-play').hide();
      $('#read-stop').hide();
      $('#read').removeClass('playing');
    };
  }
});

