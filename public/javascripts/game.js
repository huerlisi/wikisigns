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

var daily_score = 0;
var current_score = 0;
var total_score = 0;

// The border colors of the carpet when its right or false
var right_border_color = 'green';
var false_border_color = 'red';

// Reset global vars.
function resetGuessingGameGlobalVars() {
  guessed_word = '';
  word_counter = 0;
}

// Reset global vars.
function resetGameGlobalVars(word, id) {
  original_word = word;
  word_id = id;
  guessed_word = '';
  word_counter = 0;
  help_counter = 0;
}

// Shows the game menu
function initializeGameMenu() {
  initializeNewWordBehaviour();
  initializeRestartGame();
  $('#game-menu').show();
}

// Initializes the behaviour of the restart button.
function initializeRestartGame() {
  $('#restart-guessing').click(function(e){
    e.preventDefault();
    resetGuessingGameGlobalVars();
    reinitializeGuessingGame();
  });
}

function initializeWordClickBehaviour() {
  $('h1#title span').each(function() {
    $(this).addClass('selectable');
    $(this).unbind('click');
    $(this).click(function(e){
      $(this).unbind(e);
      var letter = $(this).html();

      guessed_word = guessed_word + letter;
      clearHelpIntervals();
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

// Scopes
// ======
function initializeScore() {
  if($('#current-score span').length > 0) current_score = parseInt($('#current-score span').html().trim());
  if($('#daily-score span').lenght > 0) daily_score = parseInt($('#daily-score span').html().trim());
  if($('#alltime-score span').length > 0) total_score = parseInt($('#alltime-score span').html().trim());
}

// Updates the current and the daily score.
function updateScores(score) {
  daily_score += score;
  current_score += score;
  total_score += score;
  $('#daily-score span').html(daily_score);
  $('#current-score span').html(current_score);
  $('#alltime-score span').html(total_score);
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
  var new_word;
  // Handle very short words
  if(original_word.length < 2) {
    new_word = original_word;
    return true;
  }
  
  // Shuffle
  new_word = $.shuffle(original_word.split('')).join('');

  if(original_word == new_word){
    randomizeWord();
    return false;
  }

  $('#title').html(drawColoredWord(new_word));
  $('#title').fadeIn('slow');
  return true;
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
        original_word = data['word']['word'];
        word_id = data['word']['id'];
        resetGuessingGameGlobalVars();
        reinitializeGuessingGame();
      }
    });
  });
}

// Returns the Word Id form the form.
function getWordId(text){
  var regex = /(\d+)/;

  regex.exec(text);
  return RegExp.$1;
}

// Reinitialize the game
function reinitializeGuessingGame() {
  $('h1#title-inserted span').remove();
  $('h1#title-inserted').attr('style', 'height:2.5em;');
  randomizeWord();
  drawEmptyCarpet();
  initializeWordClickBehaviour();
  restartHelp();
}