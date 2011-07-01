// Analyze Mode
// ============
function setAnalyzeMode() {
  // Clear and focus to the input field
  $('#word_word').val('');
  $('#word_word').focus().select();
}

// Redraws sign after every key stroke
function handleKeyPress(event) {
  // If character is <return>
  if(event.keyCode == 13) {
    // ...trigger form action
    $(event.currentTarget).submit();
  } else if(event.keyCode == 32) {
    // ...trigger form action
    $(event.currentTarget).submit();
  } else {
    // Show colored word
    var text = $(this).val();
    // only show last word as sign
    var word = text.split(' ').pop();

    updateWord(word);
    appendToTitle(String.fromCharCode(event.keyCode));
  }
}

// Update title on backspace
function handleKeyUp(event) {
  // If character is <backspace>
  if(event.keyCode == 8) {
    // Show colored word
    var text = $(this).val();
    // only show last word as sign
    var word = text.split(' ').pop();

    updateWord(word);

    deleteFromTitle(word.length + 1);
  }
}

// Submits and draws a new word.
function submitWord() {
  var word = $('#word_word').val();
  var text = word.trim();

  // Clear message input
  // This should be done not in the AJAX callback to not
  // loose key types too often.
  $('#word_word').val('');
  $('#word_word').focus().select();

  // Submit to server
  $.ajax({
    type: 'POST',
    data: { word : text },
    url: '/words.json',
    success: function(score){

      // Gaming
      updateScores(score);

      // Main sign
      showAsBigWord(text);

      // Add small sign to history
      addSideBarSign(text);

      // Start Session Viewer
      startSessionViewer();
    }
  })
}

// Initialize behaviours
function initializeBehaviours() {
  // Draw a new word and submit it to the database on submit
  $('#new_word').submit(function(e){
    e.preventDefault();
    submitWord();
  });

  // Redraws sign after every key stroke
  $('#word_word').keypress(handleKeyPress);
  $('#word_word').keyup(handleKeyUp);
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
