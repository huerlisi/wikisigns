var letter_speed = 314 * 3.14;
var show_word_interval;
var draw_word_interval;
var word_position;

// Show Word
// =========
function showAsBigWord(text, id) {
  // Clear message input
  $('#word_word').val('');

  // Main sign
  updateTitle(text);
  updateWord(text);

  // Context
  generateWordMenu(text, id);

  clearSessionViewerIntervals();
  showPlayAndHidePauseButton();
}

function startShowWord(word) {
  draw_word_interval = setTimeout(function(){drawWord(word, 0)}, letter_speed);
}

function drawWord(original_word, word_position) {
  if (word_position < original_word.length) {
    var word = original_word.slice(0, word_position + 1);

    // Main sign
    updateTitle(word);
    updateWord(word);

    draw_word_interval = setTimeout(function(){drawWord(original_word, word_position + 1)}, letter_speed);
  } else {
    clearInterval(show_word_interval);
    clearInterval(draw_word_interval);
    setTimeout(function(){
      session_viewer_timeout = setTimeout('showSessionViewer()', letter_speed);
    }, letter_speed*2);
  }
}
