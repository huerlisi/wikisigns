// Sharing
// =======
// Adds the tweet or facebook-like button for resharing.
function generateShareLink(slug) {
  var link = "";
  var url = 'http://' + window.location.hostname + '/word/' + slug;

  link = '<div class="social-media-links">';
  // Facebook
  link += '<fb:like layout="button_count" href="' + url + '"></fb:like>';
  link += '<fb:send href="' + url + '"></fb:send>';
  link += '<script type="text/javascript">FB.XFBML.parse()</script>';

  // Twitter
  link += '<a class="twitter-share-button" href="http://twitter.com/share" data-url="' + url + '">Tweet</a>';
  link += '<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>';

  link += '</div>';

  return link;
}

// Creates a div with a link to the PNG of the word id.
function createLinkToPNGDownload(word) {
  return '<div class="png-download-link"><a href="/word/' + word +'.png?download=true">Als Bild speichern</a></div>'
}

function createPublishToFacebookLink(id) {
  return '<div class="png-download-link"><a data-remote="true" href="/words/' + id +'/publish">Auf Facebook veröffentlichen</a></div>';
}

function generateWordMenu(text, id) {
  $('#word-menu').empty()
    .append(generateShareLink(text))
    .append(createLinkToPNGDownload(text))
    .append(createPublishToFacebookLink(id));
}

// Main Sign
// =========
function updateTitle(text) {
  $('#title-inserted').html(drawColoredWord(text));
}

function updateRiddle(text) {
  $('#title').html(drawColoredWord(text));
}

function updateWord(word) {
  drawWordAsImage($('#word'), word);
}

// Modes
// =====

// Writing Mode
// ============
function setWritingMode() {
  // We're typing, stop all gaming stuff
  abortHelp();
  clearSessionViewerIntervals();
  showPlayAndHidePauseButton();
  $('#title').hide();
}

function detectWritingMode() {
  $('#word_word').keyup(
    function(event){
      setWritingMode();
    }
  );
}

// Draw a new word and submit it to the database.
function addSessionWordsBehaviour(){
  $('#new_word').submit(function(e){
    e.preventDefault();
    newWord();
  });
}

// Redraws after every key type the word.
function addRealtimeWordDrawingBehaviour() {
  $('#word_word').keyup(function(event){
    // If character is <return>
    if(event.keyCode == 13) {
      // ...trigger form action
      $(event.currentTarget).submit();
    }
    else {
      // Show colored word
      var text = $(this).val();
      updateTitle(text);

      // only show last word as sign
      var word = text.split(' ').pop();
      updateWord(word);
    }
  });
}

// Sets focus to the input field.
function addFocusTextFieldBehaviour() {
  $('#word_word').focus().select();
}

// Play Mode
// =========
function setPlayMode() {
  // We're playing, stop all gaming stuff
  abortHelp();
  clearSessionViewerIntervals();
  showPlayAndHidePauseButton();
  $('#title').hide();
}




// Hides the table variant and shows the canvas alternative.
function showCanvasAndHideTableBehaviour() {
  $('#left-container table.carpet').hide();
  $('#word').show();

  updateWord('');
}

// Returns the container for a small word.
function oneWordDiv(id, text, prefix) {
  if(prefix == null) prefix = '';

  var word = $('<div class="one-word" data-word-id="' + id + '" data-word-word="' + text + '">');

  word.append($('<div class="word" id="word_'+ prefix + id + '">'));
  word.append($('<div class="word-text">').text(text));
  word.append($('<div class="svg-text">').html(drawColoredWord(text)));

  return word;
}

// Submits and draws a new word.
function newWord() {
  var next_word_id = $('#next_word_id') ? $('#next_word_id').val() : null;
  var text;
  var word = $('#word_word').val();

  $('#word_word').val('');
  updateTitle(word.trim());
  text = word.trim();
  addFocusTextFieldBehaviour();

  // Submit to server
  $.ajax({
    type: 'POST',
    data: { word : { word : word, next_word : next_word_id} },
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

      updateTitle('');
      updateRiddle(text);
      $('#title').show();

      // Add main sign
      updateWord(text);

      // Add small sign to history
      var words = $('#your-words');
      words.append(oneWordDiv(id, text));
      drawWordAsImage($('#word_' + id), text, 100);

      // Scroll to make new sign visible
      words.animate({scrollTop: words[0].scrollHeight});

      var one_word = $('#your-words .one-word:last-child');
      one_word.click(function(){
        showAsBigWord(one_word);
        startSessionViewer();
      });

      generateWordMenu(text, id);

      $('#next_word_id').remove();
      $('#new_word').prepend('<input id="next_word_id" type="hidden" value="' + id + '" />');

      // Start Session Viewer
      startSessionViewer();
    }
  })
}

// Sets focus to the input field.
function addFocusTextFieldBehaviour() {
  $('#word_word').focus().select();
}

// Game Mode
// =========
function detectGameMode() {
  $('#random-words-container .one-word').live('click', function(){
    showAsBigWord($(this));
    startSessionViewer();
    
    // Start game
    resetGame($(this).attr('data-word-word'), $(this).attr('data-word-id'), small_picture_help_interval_time);

    $(this).fadeOut(125).remove();
  });
}

// Colorizes the text on the show word page.
function addColorizeTextBehaviour() {
  updateTitle($('#title-inserted').text());
}

// Initialize behaviours
function initializeBehaviours() {
  addFocusTextFieldBehaviour();
  addSessionWordsBehaviour();

  // Mode detection
  detectWritingMode();
  detectGameMode();
  
  if($('#words').length > 0 || $('#facebook').length > 0 ){
    showCanvasAndHideTableBehaviour();
    addRealtimeWordDrawingBehaviour();
    $('#slug-word-share').html(generateShareLink($('#word_word').val().trim()));
    // Game merge
    if(!$('#facebook').length > 0){
      initializeGame();
      var speed = 314*3.14*3.14;
      setTimeout(function() {
        showNewRandomWord(speed)
      }, speed);
    }
  }

  if($('#shows').length > 0){
    showCanvasAndHideTableBehaviour();
  }

  if($('#word.svg').length > 0) {
    updateWord('word', $('#title').text());
  }

  // initialize only on /words/:id page.
  addColorizeTextBehaviour();
  initializeTooltips();
  shareSessionLinkBehaviour();

  addAutogrowBehaviour();
}

// iOS detection
// Code snippet from: http://www.barklund.org/blog/2010/04/23/ipad-detection/
function isAiOS() {
  return (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/));
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
