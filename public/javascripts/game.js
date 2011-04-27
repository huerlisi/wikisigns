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

var dayly_score = 0;
var current_score = 0;

// Reset global vars.
function resetGuessingGameGlobalVars() {
  //original_word = text_input.val().trim();
  guessed_word = '';
  word_counter = 0;
  //text_input.attr('value', '');
}

// Reset global vars.
function resetGameGlobalVars(word, id) {
  original_word = word;
  word_id = id;
  guessed_word = '';
  word_counter = 0;
}

// Shows the game menu
function initializeGameMenu() {
  initializeNewWordBehaviour();
  initializePublishDayScore();
  $('#game-menu').show();
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

// Updates the current and the dayly score.
function updateScores(score) {
  dayly_score += score;
  current_score += score;
  $('#daily-score span').html(dayly_score);
  $('#current-score span').html(current_score);
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

  chars.splice(position, position + 1);
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

// Publishes the Day Score to Facebook
function initializePublishDayScore() {
  $('#post-day-score-to-fb').click(function(e){
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/users/'+ $(this).attr('data-user-id') +'/daily_score',
      dataType: 'json',
      cache: true,
      beforeSend : function(xhr){
       xhr.setRequestHeader("Accept", "application/json");
      },
      success: function(data){
        if(data['id'] != null && data['id'] != ''){

        }
      }
    });
  });
}

// Gets a new Word to guess.
function initializeNewWordBehaviour() {
  $('a#get-new-word').click(function(e){
    e.preventDefault();

    $.ajax({
      type: 'GET',
      url: '/words/random.json?time=' + timeStamp(),
      dataType: 'json',
      cache: true,
      beforeSend : function(xhr){
       xhr.setRequestHeader("Accept", "application/json");
      },
      success: function(data){
        $('h1#title-inserted span').remove();
        original_word = data['word']['word'];
        word_id = data['word']['id'];
        resetGuessingGameGlobalVars();
        reinitializeGuessingGame();
      }
    });
  });
}

// Returns the Word Id form the form.
function getWordId(){
  var regex = /(\d+)/;
  var id = $('form.edit_word').attr('id');
  regex.exec(id);
  return RegExp.$1;
}

// Reinitialize the game
function reinitializeGuessingGame() {
  $('h1#title-inserted').attr('style', 'height:2.5em;');
  randomizeWord();
  drawEmptyCarpet();
  initializeWordClickBehaviour();
}