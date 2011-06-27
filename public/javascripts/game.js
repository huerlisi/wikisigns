// Timers
var help_initial_interval;
var help_initial_interval_time = 15000;
var help_interval;
var help_interval_time = 5000;
var small_picture_help_interval;
var small_picture_help_interval_time = 15000;

// Counters
var help_counter = 0;
var previous_help_counter = 0;

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

// Moves the first letter of the searched word to top as help.
function initializeFirstHelp() {
  moveLetterFromBottomToTop(original_word[help_counter]);
  help_counter++;
  clearInterval(help_initial_interval);
  help_interval = setInterval('nextHelp()', help_interval_time);
}

function initializeWordClickBehaviour() {
  $('#guess-title span').live('click', function(e) {
    $(this).unbind(e);
    var letter = $(this).html();

    guessed_word = guessed_word + letter;
    clearHelpIntervals();

    updateWord(guessed_word);

    $(this).fadeOut(125, function(){
      $('#title').append($(this).clone().hide(0, function(){
        $(this).fadeIn(125, function(){

          $('#title').removeAttr('style');
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

// Reinitialize the game
// It's also used in app/views/shared/game_menu.
function setGameMode(word) {
  if (word) {
    original_word = word;
  }

  clearSessionViewerIntervals();
  resetGameGlobalVars();
  restartHelp();

  // View
  updateTitle('');
  updateWord('');

  updateGuessTitle(shuffleWord(original_word));
}

function resetGame(word, id) {
  original_word = word;
  word_id = id;
  help_counter = 0;

  clearSessionViewerIntervals();
  resetGameGlobalVars();
  restartHelp();

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
      original_word = data['word']['word'];
      word_id = data['word']['id'];
      setGameMode();
    }
  });
}

// Reset global vars of the game
function resetGameGlobalVars() {
  guessed_word = '';
  word_counter = 0;
}

// Restarts the help.
function restartHelp() {
  abortHelp();
  help_initial_interval = setInterval('initializeFirstHelp()', help_initial_interval_time);
}

function abortHelp() {
  previous_help_counter = help_counter;
  help_counter = 0;
  clearHelpIntervals();
}

// Shows the next letter as help.
function nextHelp() {
  if(help_counter < original_word.length){
    moveLetterFromBottomToTop(original_word[help_counter]);
    help_counter++;
  }else{
    clearInterval(help_interval);
  }
}

// Clears all intervals of the help.
function clearHelpIntervals() {
  clearInterval(help_initial_interval);
  clearInterval(help_interval);
  clearInterval(small_picture_help_interval);
}

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

// Moves one letter to the solution word.
function moveLetterFromBottomToTop(letter){
  var do_once = true;

  $('#guess-title span').each(function(){
    if($(this).html().trim() == letter && do_once){
      do_once = false;
      $(this).hide(125, function(){
        var letter = $(this).html();

        guessed_word = guessed_word + letter;
        updateWord(guessed_word);
        $('#title').append($(this).clone().hide(0, function(){
          $(this).fadeIn('slow', function(){
            $('#title').removeAttr('style');
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
      })
    }
  });
}

// Checks if the guessed word has the same length and shows the result of the guessing.
function checkWords() {
  // Checks if all letters has been selected.
  if(guessed_word.length == original_word.length && !send) {
    send = true;
    var guessed = $('#title').text();
    var original = original_word;
    var div_class = '';

    // When the guessed word is right just draw it and do a post on the users facebook wall else create a new word.
    if(guessed == original){
      div_class += ' right';
    }else{
      div_class += ' false';
    }

    $.ajax({
      type: 'POST',
      data: { guessed_word: guessed, helped_letters: help_counter },
      url: '/words/' + word_id + '/games',
      dataType: 'json',
      cache: false,
      success: function(data){
        var game;

        if(data[0]['game'] != null){
          game = data[0]['game'];
        }else{
          game = data[0]['new_word_game'];
        }
        resetGame(data[1]['word']['word'], data[1]['word']['id']);

        updateTitle('');
        updateWord('');
        
        // Add small sign to random list
        addSignToBar(guessed, word_id);

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
