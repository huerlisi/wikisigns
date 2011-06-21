// Analyze Mode
// ============
function setWritingMode() {
  // We're typing, stop all gaming stuff
  abortHelp();
  clearSessionViewerIntervals();
  showPlayAndHidePauseButton();
  $('#title').hide();
}

function detectWritingMode() {
  $('#word_word').keyup(
    function(event){
      setWritingMode();
    }
  );
}

// Sets focus to the input field.
function addFocusTextFieldBehaviour() {
  $('#word_word').focus().select();
}

// Draw a new word and submit it to the database.
function addSessionWordsBehaviour(){
  $('#new_word').submit(function(e){
    e.preventDefault();
    newWord();
  });
}

// Redraws after every key type the word.
function addRealtimeWordDrawingBehaviour() {
  $('#word_word').keyup(function(event){
    // If character is <return>
    if(event.keyCode == 13) {
      // ...trigger form action
      $(event.currentTarget).submit();
    }
    else {
      // Show colored word
      var text = $(this).val();
      updateTitle(text);

      // only show last word as sign
      var word = text.split(' ').pop();
      updateWord(word);
    }
  });
}

// Submits and draws a new word.
function newWord() {
  var word = $('#word_word').val();
  var text = word.trim();

  // Clear message input
  $('#word_word').val('');
  addFocusTextFieldBehaviour();

  // Submit to server
  $.ajax({
    type: 'POST',
    data: { word : { word : text} },
    url: '/words',
    dataType: 'json',
    success: function(data){
      var id    = data[0]['word']['id'];
      var score = data[1]['new_word_game']['score'];

      // Gaming
      updateScores(score);

      // Main sign
      updateTitle('');
      updateRiddle(text);
      $('#title').show();
      updateWord(text);

      // Context
      generateWordMenu(text, id);

      // Add small sign to history
      addSignToBar(text, id);

      // Start Session Viewer
      startSessionViewer();
    }
  })
}

// Initialize behaviours
function initializeBehaviours() {
  // Behaviour setup
  addFocusTextFieldBehaviour();
  addSessionWordsBehaviour();
  addRealtimeWordDrawingBehaviour();

  // Mode detection
  detectWritingMode();
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
