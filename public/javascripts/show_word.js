var letter_speed = 1000;
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
  stopCurrentMode();

  updateWord('');
  updateTitle('');

  draw_word_timeout = setTimeout(function(){
    drawWord(word, 0, after_finish, draw_title)
  }, letter_speed);
}

function stopShowWord() {
  clearInterval(draw_word_timeout);
}

// Incremential show a word
function drawWord(word, position, after_finish, draw_title) {
  if (word && position < word.length) {
    var part = word.slice(0, position + 1);
    var new_letter = word.slice(position, position + 1);

    // Main sign
    updateWord(part);
    if(typeof(draw_title) == "undefined") {
      updateTitle(part);
    } else {
      draw_title(part);
    }

    // Call self again, incrementing position
    draw_word_timeout = setTimeout(function(){drawWord(word, position + 1, after_finish, draw_title)}, letter_speed);

  } else {
    if (typeof(after_finish) != "undefined") {
      after_finish();
    }
  }
}
