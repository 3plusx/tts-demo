
export function randomColorize() {
  const randomOffset = Math.floor(Math.random() * 40) - 20; // random number between -20 and +20
  const backgroundColor = `rgb(245, 235, ${225 + randomOffset})`;
  return backgroundColor;
}

export function wrapSegments(segments) {
  const readingDiv = $('.readings');
  readingDiv.empty();

  segments.forEach((segment, index) => {
    // const backgroundColor = randomColorize();
    const backgroundColor = "rgb(255, 255, 255)";
    const span = `<span class="segment segment-${index}" data-segment="${index}">${segment.text}</span>`;
    readingDiv.append(span);
  });
}