// The original word
var original_word;

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
// Timers
var help_initial_interval_time = 5000;
var help_interval_time = 5000;
var help_timer;

// Counters
var help_counter = 0;

// Restarts the help.
function restartHelp() {
  clearInterval(help_timer);
  help_timer = setTimeout(nextHelp, help_initial_interval_time);
}

// Shows the next letter as help.
function nextHelp() {
  var g = guessed_word();
  var l = g.length;
  if(guessed_word().length < original_word.length){
    giveHelp();
    help_counter++;
    help_timer = setTimeout(nextHelp, help_interval_time);
  }
}

// Moves one letter to the solution word.
function giveHelp(){
  // Fix a letter in guessed word if needed
  var i = 0;
  while (i < guessed_word().length) {
    // Test if character is correct
    if (guessed_word()[i] != original_word[i]) {
      $('#title span:nth(' + i + ')').click();
      // We're done with this hint
      return;
    };
    i++;
  };

  // Next letter
  var letter = original_word[guessed_word().length];
  $("#guess-title span:not(.guessed):contains('" + letter + "'):first").click();
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

// Removes a char from a string at a specified position.
function removeCharFromPos(string, position){
  var chars = string.split('');

  chars.splice(position, position + 1);
  return chars.join('');
}

function updateGuessTitle(text) {
  $('#guess-title').html(drawColoredWord(text));
}

function guessed_word() {
  return $('#title').text();
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

function handleUndo() {
  $('#title span').live('click', function(e) {
    // Disable double/multi-clicking
    $(this).unbind(e);

    // Prevent another hint from being given too fast
    restartHelp();

    var letter = $(this).html();
    $(this).animate({opacity: 0}, 1000, function() {$(this).remove()});

    var guess_letter = $("#guess-title span.guessed:contains('" + letter + "'):first");
    guess_letter.removeClass('guessed');
    guess_letter.animate({opacity: 1}, 1000);
  });
}

function initializeWordClickBehaviour() {
  $('#guess-title span:not(.guessed)').live('click', function(e) {
    // Disable double/multi-clicking
    $(this).unbind(e);

    // Prevent another hint from being given too fast
    restartHelp();

    var letter = $(this).html();

    updateWord(guessed_word());

    $(this).animate({opacity: 0.1}, 1000);
    $(this).addClass('guessed');
    appendToTitle(letter);
      
    checkWords();
  });
}

// Checks if the guessed word has the same length and shows the result of the guessing.
function checkWords() {
  // Checks if all letters has been selected.
  if(guessed_word().length == original_word.length && !send) {
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

        updateWord('');
        updateTitle('');

        send = false;
      }
    });
  }
}

// Loads functions after DOM is ready
$(document).ready(function() {
  // Actions
  initializeWordClickBehaviour();
  handleUndo();
});
