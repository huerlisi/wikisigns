// Timers
var help_initial_interval;
var help_initial_interval_time = 15000;
var help_interval;
var help_interval_time = 5000;
var alphabet_interval_time = 500;
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

var alphabet = 'abcdefghijklmnopqrstuvwxyz';

// The border colors of the carpet when its right or false
var right_border_color = 'green';
var false_border_color = 'red';

// Loads the guessing game on the root page.
// It starts with the alphabet.
function initializeGame() {
  $('#game-menu').show();
  $('h1#title-inserted span').remove();
  resetGame(alphabet, null, alphabet_interval_time);
  $('#title').show();
}

// Moves the first letter of the searched word to top as help.
function initializeFirstHelp() {
  moveLetterFromBottomToTop(original_word[help_counter]);
  help_counter++;
  clearInterval(help_initial_interval);
  if(original_word == alphabet){
    help_interval = setInterval('nextHelp()', alphabet_interval_time);
  }else{
    help_interval = setInterval('nextHelp()', help_interval_time);
  }
}

function initializeWordClickBehaviour() {
  if(original_word != alphabet) {
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
}

// Reinitialize the game
// It's also used in app/views/shared/game_menu.
function reinitializeGuessingGame() {
  clearSessionViewerIntervals();
  resetGameGlobalVars();
  $('h1#title-inserted span').remove();
  $('h1#title-inserted').height('2.5em');
  randomizeWord();
  drawEmptyCarpet();
  initializeWordClickBehaviour();
  restartHelp();
  showPlayAndHidePauseButton();
}

// Gets a new random word.
// It's used in app/views/shared/game_menu
function getANewWord() {
  clearSessionViewerIntervals();
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
      reinitializeGuessingGame();
    }
  });
}

function resetGame(word, id, interval) {
  clearSessionViewerIntervals();
  original_word = word;
  word_id = id;
  help_counter = 0;
  resetGameGlobalVars();
  randomizeWord();
  initializeWordClickBehaviour();
  restartHelp(interval);
}

// Reset global vars of the game
function resetGameGlobalVars() {
  guessed_word = '';
  word_counter = 0;
}

// Restarts the help.
function restartHelp(time) {
  if(time == null) time = help_initial_interval_time;
  abortHelp();
  help_initial_interval = setInterval('initializeFirstHelp()', time);
}

function abortHelp() {
  previous_help_counter = help_counter;
  help_counter = 0;
  clearHelpIntervals();
}

function startFirstSmallPictureHelp() {
  clearInterval(small_picture_help_interval);
  resetGame(original_word, text_input.attr('data-word-id'), small_picture_help_interval_time);
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
    $('#title').html(drawColoredWord(original_word)).fadeIn(125);
    return true;
  }
  
  // Shuffle
  new_word = $.shuffle(original_word.split('')).join('');

  $('#title').html(drawColoredWord(new_word)).fadeIn(125);
  return true;
}

// Moves one letter to the solution word.
function moveLetterFromBottomToTop(letter){
  var do_once = true;

  $('#title span').each(function(){
    if($(this).html().trim() == letter && do_once){
      do_once = false;
      $(this).hide(125, function(){
        var letter = $(this).html();

        guessed_word = guessed_word + letter;
        $('#word svg').remove();
        drawWordAsImage('word', guessed_word);
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
      })
    }
  });
}

// Checks if the guessed word has the same length and shows the result of the guessing.
function checkWords() {
  // Checks if all letters has been selected.
  if(guessed_word.length == original_word.length && !send) {
    send = true;
    var guessed = guessed_word;
    var original = original_word;
    var div_class = '';

    // When the guessed word is right just draw it and do a post on the users facebook wall else create a new word.
    if(guessed == original){
      div_class += ' right';
    }else{
      div_class += ' false';
    }

    if(original != alphabet){
      $.ajax({
        type: 'POST',
        data: { guessed_word: guessed, helped_letters: help_counter },
        url: '/words/' + word_id + '/games',
        dataType: 'json',
        cache: true,
        beforeSend : function(xhr){
          xhr.setRequestHeader("Accept", "application/json");
          $('#ajax-loader').slideDown(125);
        },
        success: function(data){
          var game;

          if(data[0]['game'] != null){
            game = data[0]['game'];
          }else{
            game = data[0]['new_word_game'];
          }

          $('#ajax-loader').slideUp(125);
          $('h1#title-inserted span').remove();
          $('#word svg').remove();
          drawEmptyCarpet();
          $('#random-words-container').append(oneWordDiv(word_id, guessed, false, 'guessed_'));
          drawWordAsImage('word_guessed_' + word_id, guessed, 100);
          $('#random-words-container').animate({scrollTop: $('#random-words-container')[0].scrollHeight});
          resetGame(data[1]['word']['word'], data[1]['word']['id']);
          updateScores(game['score']);
          send = false;
        }
      });
    }else{
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/words/guess.json?time=' + timeStamp(),
        beforeSend : function(xhr){
          xhr.setRequestHeader("Accept", "application/json");
        },
        success: function(data){
          $('h1#title-inserted span').remove();
          resetGame(data['word']['word'], data['word']['id']);
          $('#title').show();
          send = false;
        }
      });
    }
  }
}

