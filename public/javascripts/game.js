// Timers
var help_initial_interval_time = 15000;
var help_timer;
var help_interval_time = 5000;

// Counters
var help_counter = 0;

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


function startGame(word, id) {
  // Global variables
  original_word = word;
  word_id = id;

  resetGame();
}

// Reinitialize the game
function resetGame() {
  // Global variables
  guessed_word = '';
  word_counter = 0;
  help_counter = 0;

  clearSessionViewerIntervals();
  restartHelp();

  // View
  updateTitle('');
  updateWord('');
  updateGuessTitle(shuffleWord(original_word));
}

// Gets a new random word.
// It's used in app/views/shared/game_menu
function getANewWord() {
  clearSessionViewerIntervals();
  $.ajax({
    type: 'GET',
    url: '/games/random_word.json',
    dataType: 'json',
    cache: false,
    success: function(data){
      word = data['word'];

      startGame(word['word'], word['id']);
    }
  });
}

// Help
// ====
// Restarts the help.
function restartHelp() {
  clearInterval(help_timer);
  help_timer = setTimeout(nextHelp, help_initial_interval_time);
}

// Shows the next letter as help.
function nextHelp() {
  if(help_counter < original_word.length){
    giveHelp(original_word[help_counter]);
    help_counter++;
    help_timer = setTimeout(nextHelp, help_interval_time);
  }
}

// Moves one letter to the solution word.
function giveHelp(letter){
  var do_once = true;

  $('#guess-title span').each(function(){
    if($(this).html().trim() == letter && do_once){
      do_once = false;
      $(this).click();
    }
  });
}


// Highscore
// =========
// Updates scores
function updateScores(score) {
  if($('#last-score span').length > 0){
    $('#last-score span').html(score);
  }

  if($('#current-score span').length > 0){
    current_score = parseInt($('#current-score span').html().trim());
    $('#current-score span').html(current_score + score);
  }

  if($('#daily-score span').length > 0){
    daily_score = parseInt($('#daily-score span').html().trim());
    $('#daily-score span').html(daily_score + score);
  }

  if($('#alltime-score span').length > 0){
    total_score = parseInt($('#alltime-score span').html().trim());
    $('#alltime-score span').html(total_score + score);
  }
}

// Rearranges the counters for the selected letters.
function recountSelectedLetters() {
  var counter = 0;

  $('#title span').each(function(){
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

function updateGuessTitle(text) {
  $('#guess-title').html(drawColoredWord(text));
}

// Randomizes the input word.
function shuffleWord(word) {
  var new_word;

  // Handle very short words
  if(word.length < 2) {
    new_word = word;
  } else {
    // Shuffle
    new_word = $.shuffle(word.split('')).join('');
  }
  return new_word;
}

function initializeWordClickBehaviour() {
  $('#guess-title span').live('click', function(e) {
    $(this).unbind(e);
    var letter = $(this).html();

    guessed_word = guessed_word + letter;

    restartHelp();

    updateWord(guessed_word);

    $(this).fadeOut(125, function(){
      $('#title').append($(this).clone().hide(0, function(){
        $(this).fadeIn(125, function(){

          $(this).attr(DATA_WORD_COUNTER, word_counter);
          word_counter++;
          checkWords();

          $(this).click(function(e){
            $(this).unbind(e);
            word_counter--;
            guessed_word = removeCharFromPos(guessed_word, $(this).attr(DATA_WORD_COUNTER));

            $(this).fadeOut(125, function(){
              $('#guess-title').append($(this).clone().hide(0, function(){
                $(this).fadeIn(125, function(){
                  recountSelectedLetters();
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
}

// Checks if the guessed word has the same length and shows the result of the guessing.
function checkWords() {
  // Checks if all letters has been selected.
  if(guessed_word.length == original_word.length && !send) {
    send = true;
    var guessed = $('#title').text();

    $.ajax({
      type: 'POST',
      data: { guessed_word: guessed, helped_letters: help_counter },
      url: '/words/' + word_id + '/games.json',
      success: function(data){
        var game;

        if(data[0]['game'] != null){
          game = data[0]['game'];
        }else{
          game = data[0]['new_word_game'];
        }
        var word = data[1]['word'];

        startGame(word['word'], word['id']);

        // Add small sign to random list
        addSideBarSign(guessed);

        updateScores(game['score']);

        send = false;
      }
    });
  }
}

// Loads functions after DOM is ready
$(document).ready(function() {
  // Actions
  initializeWordClickBehaviour();
});
