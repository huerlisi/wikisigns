// Communication Mode
// ============
function setCommunicationMode() {
  setFocusToInput();
  // Draw a new word and submit it to the database on submit
  $('#new_word').submit(function(e){
    e.preventDefault();
    submitWord();
  });

  // Redraws sign after every key stroke
  $('#word_word').keyup(handleCommunicationKeyUp);
}

// Redraws sign after every key stroke
function handleCommunicationKeyUp(event) {
  // Stop show word when typing.
  stopShowWord();

  // If character is <return>
  if(event.keyCode == 13) {
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