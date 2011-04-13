// initialize the guessing game.
function initializeGuessingGame() {
  randomizeWord();
}

function randomizeWord() {
  var original_word = text_input.val().trim();
  var new_word = $.shuffle(original_word.split(''));

  new_word = new_word.join('');
  $('#title').html(drawColoredWord(new_word));
}

$(document).ready(initializeGuessingGame());