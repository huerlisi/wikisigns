// The original word
var original_word;
// The actual guessed word
var guessed_word;
// The counter how many words are set.
// It's used for removing the right letter from the guessed word.
var word_counter;

var word_id;

var DATA_WORD_COUNTER = 'data-word-counter';

var send = false;

// Reset global vars.
function resetGlobalVars() {
  original_word = text_input.val().trim();
  guessed_word = '';
  word_counter = 0;
  text_input.attr('value', '');
}

// initialize the guessing game.
function initializeGuessingGame() {
  resetGlobalVars();
  word_id = getWordId();
  $('h1#title-inserted').attr('style', 'height:2.5em;');
  randomizeWord();
  drawEmptyCarpet();
  initializeWordClickBehaviour();
  initializeNewWordBehaviour();
}

function initializeNewWordBehaviour() {
  $('a#get-new-word').click(function(e){
    $.ajax({
      type: 'GET',
      url: '/words/random.json?time=' + timeStamp(),
      dataType: 'json',
      cache: true,
      beforeSend : function(xhr){
       xhr.setRequestHeader("Accept", "application/json")
      },
      success: function(data){
        text_input.attr('value', data['word']['word']);
        word_id = data['word']['id'];
        original_word = text_input.val();
        reinitializeGuessingGame();
      }
    });
  });
}

function getWordId(){
  var regex = /(\d+)/;
  var id = $('form.edit_word').attr('id');
  regex.exec(id);
  return RegExp.$1;
}

function reinitializeGuessingGame() {
  $('h1#title-inserted').attr('style', 'height:2.5em;');
  randomizeWord();
  drawEmptyCarpet();
  initializeWordClickBehaviour();
}

function initializeWordClickBehaviour() {
  $('h1#title span').each(function() {
    $(this).addClass('selectable');
    $(this).unbind('click');
    $(this).click(function(e){
      $(this).unbind(e);
      var letter = $(this).html();

      guessed_word = guessed_word + letter;
      $('#word svg').remove();
      drawWordAsImage('word', guessed_word);
      $(this).removeClass('selectable');

      $(this).fadeOut(125, function(){
        $('#title-inserted').append($(this).clone().hide(0, function(){
          $(this).fadeIn('slow', function(){

            $('h1#title-inserted').removeAttr('style');
            $(this).attr(DATA_WORD_COUNTER, word_counter);
            word_counter++;
            checkWords();

            $(this).click(function(e){
              $(this).unbind(e);
              word_counter--;
              guessed_word = removeCharFromPos(guessed_word, $(this).attr(DATA_WORD_COUNTER));

              $(this).fadeOut(125, function(){
                $('h1#title').append($(this).clone().hide(0, function(){
                  $(this).fadeIn(125, function(){
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
    });
  });
}

function displayedWords() {
  var text = '';

  $('#title-inserted span').each(function(){
    text += $(this).html().trim();
  });

  return text;
}
function checkWords() {
  // Checks if all letters has been selected.
  if(displayedWords().length == original_word.length && !send) {
    send = true;
    var guessed = guessed_word;
    var original = original_word;
    var div_class = '';

    resetGlobalVars();

    // When the guessed word is right just draw it and do a post on the users facebook wall else create a new word.
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
       xhr.setRequestHeader("Accept", "application/json")
       $('#ajax-loader').slideDown(125);
      },
      success: function(data){
        $('#ajax-loader').hide(0, function(){
          $('#your-solutions').prepend('<div class="points ' + div_class +'">'+ data[0]['game']['score'] +'</div>');
          $('#your-solutions').prepend('<div class="word' + div_class +' word-text">' + drawColoredWord(data[0]['game']['input']) + '</div>');
          $('#searched-solutions').prepend('<div class="word' + div_class +' word-text">' + drawColoredWord(original) + '</div>');
          addSmallWordAttributesForSessionView(drawWordAsImage('solution-images', guessed));
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

    /*$.ajax({
      type: 'POST',
      url: '/words/' + word_id + '/games',
      dataType: 'json',
      beforeSend : function(xhr){
       xhr.setRequestHeader("Accept", "application/json")
      },
      success: function(data){
        text_input.attr('value', data['game']);
        $('h1#title-inserted span').remove();
        $('#word svg').remove();
        original_word = text_input.val();
        reinitializeGuessingGame();
      }
    }); */
  }
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
  $('#word svg').remove();
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