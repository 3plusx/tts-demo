
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
  const sentenceRegex = /([^?.!]+[?.!:]+|[^?.!:]+$)/g;
  $('.readings').find('h1, h2, h3, h4, h5, h6, p, ul li, blockquote').each(function() {
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
      if ( match.trim() === '' ) return match; // skip empty matches

      const result = calculateWER(match, segments[index]?.text || "" );
      console.log(`\nSegment ${index}: Accuracy: ${result.accuracy}% | WER: ${result.wordErrorRate}`);
      if ( result.accuracy < 70 ) return match; // skip non-matching sentences

      const id = index++;
      console.log("Wrapped sentence:", match.trim());
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


function preprocessText(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:—–\-"']/g, '') // Satzzeichen entfernen
    .replace(/\s+/g, ' ')            // Mehrfache Leerzeichen normalisieren
    .trim();
}
// Word Error Rate (WER) - Standard-Metrik für Spracherkennungsgenauigkeit
function calculateWER(original, transcribed) {
  const origWords = preprocessText(original).split(' ').filter(w => w);
  const transWords = preprocessText(transcribed).split(' ').filter(w => w);
  
  // Edit-Distance-Matrix (Levenshtein auf Wort-Ebene)
  const matrix = [];
  
  for (let i = 0; i <= transWords.length; i++) {
    matrix[i] = new Array(origWords.length + 1).fill(0);
    matrix[i][0] = i;
  }
  
  for (let j = 0; j <= origWords.length; j++) {
    matrix[0][j] = j;
  }
  
  // Füllen der Matrix
  for (let i = 1; i <= transWords.length; i++) {
    for (let j = 1; j <= origWords.length; j++) {
      const cost = transWords[i - 1] === origWords[j - 1] ? 0 : 1;
      
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,          // Deletion (Wort fehlt)
        matrix[i][j - 1] + 1,          // Insertion (Wort zu viel)
        matrix[i - 1][j - 1] + cost    // Substitution (Wort falsch)
      );
    }
  }
  
  const errors = matrix[transWords.length][origWords.length];
  const wer = (errors / origWords.length) * 100;
  
  return {
    wordErrorRate: Math.round(wer * 100) / 100,
    accuracy: Math.round((100 - wer) * 100) / 100,
    totalWords: origWords.length,
    errors: errors,
    originalWords: origWords,
    transcribedWords: transWords
  };
}
