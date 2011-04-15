// The original word
var original_word;
// The actual guessed word
var guessed_word = '';
// The counter how many words are set.
// It's used for removing the right letter from the guessed word.
var word_counter = 0;

var DATA_WORD_COUNTER = 'data-word-counter';

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
    $(this).unbind('click');
    $(this).click(function(){
      var letter = $(this).html();

      //text_input.attr('value', text_input.val() + letter);
      guessed_word = guessed_word + letter;
      $('#word svg').remove();
      drawWordAsImage('word', guessed_word);
      $(this).removeClass('selectable');

      $(this).fadeOut('slow', function(){
        $('#title-inserted').append($(this).clone().hide(0, function(){
          $(this).fadeIn('slow', function(){
            $('h1#title-inserted').removeAttr('style');
            $(this).attr(DATA_WORD_COUNTER, word_counter);
            word_counter++;
            $(this).click(function(){
              word_counter--;
              guessed_word = removeCharFromPos(guessed_word, $(this).attr(DATA_WORD_COUNTER));
              $(this).fadeOut('slow', function(){
                $('h1#title').append($(this).clone().hide(0, function(){
                  $(this).fadeIn('slow', function(){
                    recountSelectedLetters();
                    initializeWordClickBehaviour();
                  });
                }));
                $(this).remove();
              });
            });
          });
        }));
        $(this).remove();
      });

      if(guessed_word.length == original_word.length) {
        //console.log(original_word);
        alert('Das richtige Wort lautet: ' + original_word);
      }
    });
  });
}

// Rearranges the counters for the selected letters.
function recountSelectedLetters() {
  var counter = 0;
  $('#title-inserted span').each(function(){
    $(this).attr(DATA_WORD_COUNTER, counter);
    counter++;
  });
}

// Removes a char from a string at a specified position.
function removeCharFromPos(string, position){
  var chars = string.split('');

  chars.splice(position, position);
  return chars.join('');
}

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