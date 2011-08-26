// Game Mode
// =========
// The original word
var original_word;
var word_id;
var send = false;


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
  startHelp();

  // View
  updateTitle('');
  updateWord('');
  updateGuessTitle(shuffleWord(original_word));
  showPlayAndHidePauseButton();
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
      startGame(data.word.word, data.word.id);
    }
  });
}

// Help
// ====
// Timers
var help_initial_interval_time = 15000;
var help_interval_time = 5000;
var help_timeout;

// Counters
var help_counter = 0;

// Starts the help.
function startHelp() {
  stopHelp();
  help_timeout = setTimeout(nextHelp, help_initial_interval_time);
}

// Restarts the help.
function restartHelp() {
  help_timeout = setTimeout(nextHelp, help_interval_time);
}

// Shows the next letter as help.
function nextHelp() {
  if(guessed_word().length < original_word.length){
    giveHelp();
    help_counter++;
  }
}

function stopHelp() {
  clearTimeout(help_timeout);
  help_timeout = null;
}

// Moves one letter to the solution word.
function giveHelp(){
  // Fix a letter in guessed word if needed
  var i = 0;
  var g = guessed_word();

  while (i < g.length) {
    // Test if character is correct
    if (g[i] != original_word[i]) {
      doGuess($('#title span:nth(' + i + ')'), restartHelp);
      // We're done with this hint
      return;
    }
    i++;
  }

  // Next letter
  var letter = original_word[g.length];
  doGuess($("#guess-title span:not(.guessed):contains('" + letter + "'):first"), restartHelp);
}


// Highscore
// =========
// Globals
var daily_score = 0;
var current_score = 0;
var total_score = 0;

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

function updateGuessTitle(text) {
  $('#guess-title').html(drawColoredWord(text)).animate({opacity: 1}, 1000);
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
  // Prevent another hint from being given too fast
  startHelp();

  var letter = $(this).html();
  $(this).animate({opacity: 0}, 1000, function() {$(this).remove()});

  var guess_letter = $("#guess-title span.guessed:contains('" + letter + "'):first");
  guess_letter.removeClass('guessed');
  guess_letter.animate({opacity: 1}, 1000);
}

function handleGuess() {
  // Prevent another hint from being given too fast
  stopHelp();
  doGuess(this, startHelp);
}

function doGuess(element, callback) {
  var letter = $(element).html();

  $(element).animate({opacity: 0.1}, 1000);
  $(element).addClass('guessed');
  appendToTitle(letter);
  updateWord(guessed_word());
  checkWords();

  if(callback){
    callback();
  }
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

// Setup handlers
function setupGameModeHandlers() {
  $('#guess-title span:not(.guessed)').live('click', handleGuess);
  $('#title span').live('click', handleUndo);
}

// Teardown handlers
function teardownGameModeHandlers() {
  $('#guess-title span:not(.guessed)').die('click', handleGuess);
  $('#title span').die('click', handleUndo);
}

function startGameMode(word, id) {
  // Handlers
  setupGameModeHandlers();
  stopCurrentMode = stopGameMode;

  // Start gaming
  startGame(word, id);
}

function stopGameMode() {
  // Fade out guess title
  $('#guess-title').animate({opacity: 0}, 1000).empty();
}

afterShowSmallSign = getANewWord;
