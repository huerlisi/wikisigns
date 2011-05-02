var text_input = $('#word_word');

var help_initial_interval;
var help_initial_interval_time = 15000;
var help_interval;
var help_interval_time = 5000;
var help_counter = 0;
var previous_help_counter = 0;
var small_picture_help_interval;
var small_picture_help_interval_time = 2000;

function resetGame(word, word_id, interval) {
  resetGameGlobalVars(word, word_id);
  randomizeWord();
  initializeWordClickBehaviour();
  restartHelp(interval);
}

// Loads the guessing game on the root page.
function initializeGame() {
  initializeGameMenu();
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
    }
  });
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

// Starts the special animation and help when a small picture was clicked.
function startSmallPictureHelp() {
  small_picture_help_interval = setInterval('startFirstSmallPictureHelp()', small_picture_help_interval_time)
}

function startFirstSmallPictureHelp() {
  var letters = $('#title-inserted span');

  clearInterval(small_picture_help_interval);

  letters.hide(125, function(){
    letters.remove();
  });

  resetGame(text_input.val(), text_input.attr('data-word-id'), small_picture_help_interval_time);
}

// Moves the first letter of the searched word to top as help.
function initializeFirstHelp() {
  moveLetterFromBottomToTop(original_word[help_counter]);
  help_counter++;
  clearInterval(help_initial_interval);
  help_interval = setInterval('nextHelp()', help_interval_time);
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

// Checks if the guessed word has the same length and shows the result of the guessing.
function checkWords() {
  // Checks if all letters has been selected.
  if(displayedWords().length == original_word.length && !send) {
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
        displaySessionSmallWord(drawWordAsImage('word', guessed, getBorderColor(game['won'])).clone(), guessed, word_id);
        drawEmptyCarpet();
        resetGame(data[1]['word']['word'], data[1]['word']['id']);
        updateScores(game['score']);
        send = false;
      }
    });
  }
}

// Returns the border color for the word.
function getBorderColor(won){
  if(won){
    return right_border_color;
  }else{
    return false_border_color;
  }
}

// Returns a timestamp string, used for ajax requests.
function timeStamp() {
  var time = new Date().getTime();
  return time.toString();
}

// Adds the tweet or facebook-like button for resharing.
function addReshareBehaviour() {
  $('#slug-word-share').html(generateShareLink(text_input.val().trim()));
}

// Adds a mouseover effect to the latest words.
function addInitialResizeBehaviour() {
  $('#top-container-scroll div.one-word').each(function(){
    $(this).addClass('selectable');
    $(this).click(function(){
      showSmallPictureAsBigWord(this);
    });
  });
}

// Shows a small word picture in the big main word.
function showSmallPictureAsBigWord(element) {
  var word = '';

  abortHelp();

  // Read the word from within the span tags.
  $(element).children('.word-text').children('span').each(function(){
    word += $(this).html().trim();
  });

  text_input.attr('data-word-id', getWordId($(element).children('.word').attr('id')));
  text_input.val(word);
  $('#word svg').remove();
  drawWordAsImage('word', word);
  $('#title-inserted').html(drawColoredWord(text_input.val()));
  $('#title span').hide(125, function(){
    $(this).remove();
  });
  startSmallPictureHelp();
}

//
function addRealtimeWordDrawingBehaviour() {
  text_input.keyup(function(event){
    if(event.keyCode != 13) {
      $('#title').hide();
      $('#word').children().remove();
      drawWordAsImage('word', $(this).val().trim());
      $('#title-inserted').html(drawColoredWord($(this).val().trim()));

      if($(this).val().indexOf(' ', 0) > -1) {
        newWord();
      }
    }
  });
}

// Colorizes the text on the show word page.
function addColorizeTextBehaviour() {
  var text_field = $('#title-inserted');

  text_field.html(drawColoredWord(text_field.text().trim()));
}

// Draw a new word at the top of the page.
function drawLatestWords() {
  $('#top-container').attr('style', 'height: 80px;');
  $('#top-container-scroll').attr('style', 'width:1320px;');
  $('#top-container-scroll .one-word .word').each(function(){
    var text = $(this).next('.word-text').text().trim();
    var word = drawWordAsImage($(this).attr('id'), text);

    addSmallWordAttributesForRandomView(word);
    $(this).prev('table.carpet').hide();
    $(this).next('.word-text').html(drawColoredWord(text));
  });
}

// Sets the interval for new random entry at the top of the page.
function addRandomLatestUpdateBehaviour() {
  window.setInterval(updateRandomLatest, 5000);
}

// Shows a new random entry at the top of the page.
function updateRandomLatest() {
  var container = $('#top-container-scroll');
  var last_child = container.children('.one-word:last-child');

  $.ajax({
    type: 'GET',
    url: '/words/random?time=' + timeStamp(),
    success: function(data){
      last_child.fadeOut(125);
      last_child.remove();
      container.prepend(data);

      var text = $(data).children('.word-text').text().trim();
      var word = drawWordAsImage($(data).children('.word').attr('id'), text);

      addSmallWordAttributesForRandomView(word);
      $('#top-container-scroll .one-word:first-child .word-text').html(drawColoredWord(text));
      $('#top-container-scroll .one-word:first-child').addClass('selectable');
      $('#top-container-scroll .one-word:first-child').click(function(){
        showSmallPictureAsBigWord(this);
      });
    }
  });
}

// Hides the table variant and shows the canvas alternative.
function showCanvasAndHideTableBehaviour() {
  $('#left-container table.carpet').hide();
  $('#word').show();
  drawWordAsImage('word', $('#title').text().trim());
  //$('#title').html(drawColoredWord(text_input.val().trim()));
}

// Draw a new word and submit it to the data base.
function addSessionWordsBehaviour(){
  $('#center-container').attr('style', 'display:block;');

  $('#new_word').submit(function(e){
    e.preventDefault();
    newWord();
  });

  $('form.edit_word').submit(function(e){
    e.preventDefault();
    newWord();
    $('#slug-word-share').remove();
  });
}

// Submits and draws a new word.
function newWord() {
  var next_word_id = $('#next_word_id') ? $('#next_word_id').val() : null;
  var text;

  $('#title-inserted').html(drawColoredWord(text_input.val().trim()));
  text = $('#title-inserted').text().trim();
  addFocusTextFieldBehaviour();
  $('#word').children().remove();


  $.ajax({
    type: 'POST',
    data: { word : { word : text_input.val(), next_word : next_word_id} },
    url: '/words',
    dataType: 'json',
    success: function(data){
      var id = data[0]['word']['id'];
      var game;

      if(data[1]['game'] != null){
        game = data[1]['game'];
      }else{
        game = data[1]['new_word_game'];
      }

      updateScores(game['score']);
      $('#title').show();
      $('#title-inserted span').remove();
      displaySessionSmallWord(drawWordAsImage('word', text, getBorderColor(game['won'])).clone(), text, id);
      drawEmptyCarpet();

      if($('.twitter-user').length>0){
        $('a.twitter-share-button').each(function(){
          var tweet_button = new twttr.TweetButton( $(this).get(0) );
          tweet_button.render();
        });
      }

      $('#next_word_id').remove();
      $('#new_word').prepend('<input id="next_word_id" type="hidden" value="' + id + '" />');
    }
  })
}

// Modifies the word picture attributes for the small word picture for use in the session view (on the right side).
function addSmallWordAttributesForSessionView(word_picture){
  word_picture[0].setAttribute('viewBox', '1 1 430 430');
  word_picture[0].setAttribute('width', '100');
  word_picture[0].setAttribute('height', '100');

  return word_picture;
}

// Modifies the word picture attributes for the small word picture for use in the random view (on the top).
function addSmallWordAttributesForRandomView(word_picture){
  word_picture[0].setAttribute('viewBox', '1 1 430 430');
  word_picture[0].setAttribute('width', '50');
  word_picture[0].setAttribute('height', '50');

  return word_picture;
}

// Sets focus to the input field.
function addFocusTextFieldBehaviour() {
  text_input.focus().select();
}

// Creates a div with a link to the PNG of the word id.
function createLinkToPNGDownload(id) {
  return '<div class="png-download-link"><a href="/words/' + id +'/svg.png?download=true">Als Bild speichern</a></div>'
}

// Initialize behaviours
function initializeBehaviours() {
  addFocusTextFieldBehaviour();
  addSessionWordsBehaviour();

  // initialize only on /words/new page.
  if($('#words').length > 0 || $('#word.svg').length > 0 || $('#facebook').length > 0 ){
    addRandomLatestUpdateBehaviour();
    drawLatestWords();
    showCanvasAndHideTableBehaviour();
    addRealtimeWordDrawingBehaviour();
    addInitialResizeBehaviour();
    addReshareBehaviour();
    // Game merge
    if(!$('#facebook').length > 0){
      initializeGame();
    }
  }

  // initialize only on /words/:id page.
  if($('#show-word').length > 0){
    addColorizeTextBehaviour();
  }
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
