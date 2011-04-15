// The original word.
var original_word;

// initialize the guessing game.
function initializeGuessingGame() {
  original_word = text_input.val().trim();
  text_input.attr('value', '');
  $('h1#title-inserted').attr('style', 'height:2.5em;');
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
      $(this).fadeOut('slow', function(){
        $('#title-inserted').append($(this).clone().hide(0, function(){
          $(this).fadeIn('slow', function(){
            $('h1#title-inserted').removeAttr('style');
          });
        }));
      });

      if(text_input.val().length == original_word.length) {
        //console.log(original_word);
        alert('Das richtige Wort lautet: ' + original_word);
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
  $('#title').fadeIn('slow');
}

// Starts the initialization of the game when the document is fully loaded.
$(document).ready(initializeGuessingGame());