
export function randomColorize() {
  const randomOffset = Math.floor(Math.random() * 40) - 20; // random number between -20 and +20
  const backgroundColor = `rgb(245, 235, ${225 + randomOffset})`;
  return backgroundColor;
}

export function wrapSegments(segments) {
  const readingDiv = $('.readings');
  readingDiv.empty();
  console.log("👌 Wrapping", segments.length, "segments.");

  segments.forEach((segment, index) => {
    // const backgroundColor = randomColorize();
    const backgroundColor = "rgb(255, 255, 255)";
    const span = `<span class="segment segment-${index}" data-segment="${index}">${segment.text}</span>`;
    readingDiv.append(span);
  });
}
export function wrapContentText(segments) {

  let index = 0;
  const sentenceRegex = /([^?.!]+[?.!:]+)/g;
  $('.readings').find('p, ul li, blockquote').each(function() {
    var html = $(this).html();  
    // extract tags to tokens
    const tokenPrefix = '___TAG___';
    const tokens = [];
    html = html.replace(/<[^>]+>/g, (tag) => {
      const token = `${tokenPrefix}${tokens.length}___`;
      tokens.push(tag);
      return token;
    });    
    // wrap sentences (tokens preserved inside matched text)
    html = html.replace(sentenceRegex, (match) => {
      const id = index++;
      return `<span class="segment segment-${id}" data-segment="${id}">${match.trim()} </span>`;
    });
    // restore original tags
    html = html.replace(new RegExp(tokenPrefix + '(\\d+)___', 'g'), (_, n) => tokens[Number(n)]);

    $(this).html(html);
  });
  if (index+1 !== segments.length) {
    console.warn("⚠️ Mismatch in segments length:", segments.length, "and wrapped sentences:", index+1);
  } else {
    console.log("👌 Wrapped all", index+1, "sentences.");
  }
}
