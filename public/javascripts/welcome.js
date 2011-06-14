// Welcome Mode
// ============

var alphabet_interval_time = 314*3.14;
var alphabet = 'abcdefghijklmnopqrstuvwxyz';

// Loads the guessing game on the root page.
// It starts with the alphabet.
function setWelcomeMode() {
  $('#title').show();
  updateRiddle(alphabet);
  startShowWord();
}

$(document).ready(setWelcomeMode);
