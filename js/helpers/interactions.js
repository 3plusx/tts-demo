import { timer } from './timer.js';

export function handleReadButtonClick(audio, segments, timerCallback) {
    $('#read').on('click', function() {
        console.log("Click for element with ", $(this).attr('class'));

        if ( $(this).hasClass('playing') ) {
            updateReadButtonStatus('paused');

            $('#read').data('status', 'paused');
            $('#read').data('playtime', 0);
            audio.currentTime = 0;
            audio.pause();
            var allSegments = document.querySelectorAll('.segment');
            allSegments.forEach(function(segment) {
                segment.classList.remove('current');
            });
            console.log("🎵 Audio stopped");    
        } else {
            console.log('🎵 Audio playing ');
            updateReadButtonStatus('playing');            
            audio.play();
            timer(segments, audio, '#read');
            audio.onended = function() {
                updateReadButtonStatus('finished');
                $('#read').data('status', 'finished');
                resetSegments();
                console.log("🎵 Audio ended");
            };
        }
    });
}


function resetSegments() {
    const allSegments = document.querySelectorAll('.segment');
    allSegments.forEach(segment => segment.classList.remove('current'));
}
function updateReadButtonStatus(status) {
    $('#read').data('status', status);
    if (status === 'playing') {
        $('#read-ready').hide();
        $('#read-play').show();
        $('#read-stop').hide();
        $('#read').addClass('playing');
        $('.readings').addClass('while_playing');
    } else if (status === 'paused') {
        $('#read-ready').hide();
        $('#read-play').hide();
        $('#read-stop').show();
        $('#read').removeClass('playing');
        $('.readings').removeClass('while_playing');
    } else if (status === 'finished') {
        $('#read-ready').show();
        $('#read-play').hide();
        $('#read-stop').hide();
        $('#read').removeClass('playing');
        $('.readings').removeClass('while_playing');
    }
}