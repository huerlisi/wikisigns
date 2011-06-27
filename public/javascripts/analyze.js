// Analyze Mode
// ============
function setAnalyzeMode() {
  // We're typing, stop all gaming stuff
  abortHelp();
  clearSessionViewerIntervals();
  showPlayAndHidePauseButton();

  // Clear and focus to the input field
  $('#word_word').val('');
  $('#word_word').focus().select();
}

// Redraws sign after every key stroke
function handleKey(event) {
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
    updateTitle(text);
  }
}

// Submits and draws a new word.
function submitWord() {
  var word = $('#word_word').val();
  var text = word.trim();

  // Submit to server
  $.ajax({
    type: 'POST',
    data: { word : { word : text} },
    url: '/words',
    dataType: 'json',
    success: function(data){
      var score = data[1]['new_word_game']['score'];

      // Clear message input
      $('#word_word').val('');
      $('#word_word').focus().select();

      // Gaming
      updateScores(score);

      // Main sign
      updateWord(text);
      updateTitle(text);

      // Context
      generateWordMenu(text);

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
  $('#word_word').keyup(handleKey);
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
