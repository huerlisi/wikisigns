// Welcome Mode
// ============

// Loads the guessing game on the root page.
// It starts with the alphabet.
function setWelcomeMode() {
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';

  startShowWord(alphabet, function(){
    $('#left-container').hide(125, function(){
      window.location = '/words/new';
    });
  });
}

$(document).ready(initializeBehaviours);
