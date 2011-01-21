// Initialize behaviours
function initializeBehaviours() {
  addFocusTextFieldBehaviour();
}

function addFocusTextFieldBehaviour() {
  $('#word_word').focus().select();
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
