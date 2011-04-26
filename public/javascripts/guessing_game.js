// initialize the guessing game.
function initializeGuessingGame() {
  resetGlobalVars();
  word_id = getWordId();
  $('h1#title-inserted').attr('style', 'height:2.5em;');
  randomizeWord();
  drawEmptyCarpet();
  initializeWordClickBehaviour();
  initializeNewWordBehaviour();
  initializePublishDayScore();
  dayly_score = parseInt($('#dayly-score').html().trim());
  current_score = parseInt($('#current-score').html().trim());
}

function reinitializeGuessingGame() {
  $('h1#title-inserted').attr('style', 'height:2.5em;');
  randomizeWord();
  drawEmptyCarpet();
  initializeWordClickBehaviour();
}

// Starts the initialization of the game when the document is fully loaded.
$(document).ready(initializeGuessingGame());