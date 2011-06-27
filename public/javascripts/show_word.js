var letter_speed = 314 * 3.14;
var show_word_interval;
var draw_word_interval;

// Show Word
// =========
function showAsBigWord(text) {
  // Clear message input
  $('#word_word').val('');

  // Main sign
  updateTitle(text);
  updateWord(text);

  // Context
  generateWordMenu(text);

  clearSessionViewerIntervals();
  showPlayAndHidePauseButton();
}

function startShowWord(word) {
  draw_word_interval = setTimeout(function(){drawWord(word, 0)}, letter_speed);
}

function drawWord(word, position) {
  if (position < word.length) {
    var part = word.slice(0, position + 1);

    // Main sign
    updateTitle(part);
    updateWord(part);

    // Call self again, incrementing position
    draw_word_interval = setTimeout(function(){drawWord(word, position + 1)}, letter_speed);
  } else {
    clearInterval(show_word_interval);
    setTimeout(function(){
      session_viewer_timeout = setTimeout('showSessionViewer()', letter_speed);
    }, letter_speed*2);
  }
}
