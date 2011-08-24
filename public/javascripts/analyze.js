// Analyze Mode
// ============
function setAnalyzeMode() {
  // Clear and focus to the input field
  setFocusToInput();
  setupAnalyzeModeHandlers();
}

function setFocusToInput() {
  $('#word_word').val('');
  $('#word_word').focus().select();
}

// Redraws sign after every key stroke
function handleKeyUp(event) {
  // Stop show word when typing.
  stopShowWord();

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
    updateTitle(word);
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

  // Empty main
  updateTitle('');
  updateWord('');

  // Submit to server
  $.ajax({
    type: 'POST',
    data: { word : text },
    url: '/words.json',
    success: function(score){

      // Gaming
      updateScores(score);

      // Main sign
      showAsBigWord('');

      // Add small sign to history
      addSideBarSign(text);

      // Start Session Viewer
      startSessionViewer();
    }
  })
}

// Setup handlers
function setupAnalyzeModeHandlers() {
  // Draw a new word and submit it to the database on submit
  $('#new_word').submit(function(e){
    e.preventDefault();
    submitWord();
  });

  // Redraws sign after every key stroke
  $('#word_word').keyup(handleKeyUp);
}

