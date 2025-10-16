export function timer(segments, audio, statusSelector)  {
  console.log("🕑 Timer started with ", segments.length," segments");
  const startTime = Date.now(); // Startzeitpunkt in Millisekunden
 
  var currentSegment = document.querySelector('.segment-0');
  if (currentSegment) {
    currentSegment.classList.add('current');
  }
  var index = 0;
  console.log("+++++++++++ Segment", index);
  console.log("\"", segments[index].text, "\"");    
  const intervalId = setInterval(() => {
    
    const currentTime = Date.now();

    // integer (= seconds)
    // const runTime = Math.floor((currentTime - startTime) / 1000);
    // float (= seconds with 2 decimal places)
    const runTime = parseFloat(((currentTime - startTime) / 1000).toFixed(2));
    console.log("🕑 Intervall runs for ",runTime, "seconds. Segment ends at", segments[index].end);
    if (segments[index] === undefined) {
      console.log("No more segments");
      clearInterval(intervalId);
    }
    if ( runTime >= segments[index].end ) {
      var currentSegment = document.querySelector('.segment-'+index);
      currentSegment.classList.remove('current');
      index++;
      console.log("+++++++++++ Segment", index);
      console.log("\"", segments[index].text, "\"");
      var nextSegment = document.querySelector('.segment-' + index);
      if (nextSegment) {
        nextSegment.classList.add('current');
      }
    }
    currentSegment = nextSegment;
    if (runTime >= 330) {
      console.log("Timeout limit");
      clearInterval(intervalId);
    }
    var status = $('#read').data('status');
    // console.log("Audio ", status);
    if (status === 'paused' || status === 'finished') {
      console.log("Stop timer");
      clearInterval(intervalId);
      return;
    }
    // TODO: stop mechanism if button is pressed!

  }, 1000); // 1 sec. interval
}
