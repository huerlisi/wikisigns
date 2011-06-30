var letter_speed = 314 * 3.14;
var draw_word_timeout;

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

function startShowWord(word, after_finish, draw_title) {
  draw_word_timeout = setTimeout(function(){
    drawWord(word, 0, after_finish, draw_title)
  }, letter_speed);
}

function stopShowWord() {
  clearInterval(draw_word_timeout);
}

// Incremential show a word
function drawWord(word, position, after_finish, draw_title) {
  if (position < word.length) {
    var part = word.slice(0, position + 1);

    // Main sign
    updateWord(part);
    if(typeof(draw_title) == "undefined") {
      updateTitle(part);
      // Call self again, incrementing position
      draw_word_timeout = setTimeout(function(){drawWord(word, position + 1, after_finish, draw_title)}, letter_speed);
    }else{
      draw_title(part, function(){
        draw_word_timeout = setTimeout(function(){drawWord(word, position + 1, after_finish, draw_title)}, letter_speed);
      });
    }
  } else {
    if (typeof(after_finish) != "undefined") {
      after_finish();
    }
  }
}
