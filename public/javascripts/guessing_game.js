// The original word.
var original_word;

// initialize the guessing game.
function initializeGuessingGame() {
  original_word = text_input.val().trim();
  text_input.attr('value', '');
  randomizeWord();
  drawEmptyCarpet();
  initializeWordClickBehaviour();
}

function initializeWordClickBehaviour() {
  $('h1#title span').each(function(){
    $(this).addClass('selectable');
    $(this).click(function(){
      var letter = $(this).html();

      text_input.attr('value', text_input.val() + letter);
      $('#word svg').remove();
      drawWordAsImage('word', text_input.val());
      $(this).removeClass('selectable');
      $(this).unbind('click');
      if(text_input.val().length == original_word.length) {
        //console.log('finished');
      }
    });
  });
}

// Adds a new letter into the input field.

// Draws an empty carpet and hides the table version of the carpet.
function drawEmptyCarpet() {
  $('table.carpet').remove();
  drawWordAsImage('word', '');
}

// Randomizes the input word and draws it colored.
function randomizeWord() {
  var new_word = $.shuffle(original_word.split(''));

  new_word = new_word.join('');
  $('#title').html(drawColoredWord(new_word));
}

// Starts the initialization of the game when the document is fully loaded.
$(document).ready(initializeGuessingGame());