// initialize the guessing game.
function initializeGuessingGame() {
  initializeGameMenu();
  resetGuessingGameGlobalVars();
  word_id = getWordId($('form.edit_word').attr('id'));
  $('h1#title-inserted').attr('style', 'height:2.5em;');
  randomizeWord();
  drawEmptyCarpet();
  initializeWordClickBehaviour();
  dayly_score = parseInt($('#daily-score span').html().trim());
  current_score = parseInt($('#current-score span').html().trim());
}

function checkWords() {
  // Checks if all letters has been selected.
  if(displayedWords().length == original_word.length && !send) {
    send = true;
    var guessed = guessed_word;
    var original = original_word;
    var div_class = '';

    resetGuessingGameGlobalVars();

    // When the guessed word is right just draw it else create a new word.
    if(guessed == original){
      div_class += ' right';
    }else{
      div_class += ' false';
    }

    $.ajax({
      type: 'POST',
      data: { guessed_word: guessed },
      url: '/words/' + word_id + '/games',
      dataType: 'json',
      cache: true,
      beforeSend : function(xhr){
       xhr.setRequestHeader("Accept", "application/json");
       $('#ajax-loader').slideDown(125);
      },
      success: function(data){
        $('#ajax-loader').hide(0, function(){
          $('#your-solutions').prepend('<div class="points ' + div_class +'">'+ data[0]['game']['score'] +'</div>');
          $('#your-solutions').prepend('<div class="word' + div_class +' word-text">' + drawColoredWord(data[0]['game']['input']) + '</div>');
          $('#searched-solutions').prepend('<div class="word' + div_class +' word-text">' + drawColoredWord(original) + '</div>');
          addSmallWordAttributesForSessionView(drawWordAsImage('solution-images', guessed));
          updateScores(data[0]['game']['score']);
        });

        text_input.attr('value', data[1]['word']['word']);
        word_id = data[1]['word']['id'];
        $('h1#title-inserted span').remove();
        $('#word svg').remove();
        original_word = text_input.val();
        reinitializeGuessingGame();
        send = false;
      }
    });
  }
}

// Starts the initialization of the game when the document is fully loaded.
$(document).ready(initializeGuessingGame());