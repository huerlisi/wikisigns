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

// Bars
// ====
function addSignToBar(bar, text, id) {
  // Create element
  var sign = oneWordDiv(id, text);
  // Add to bar
  bar.append(sign);
  // Draw sign
  drawWordAsImage(sign.find('.word'), text, 100);
  // Scroll to make new sign visible
  bar.animate({scrollTop: bar[0].scrollHeight});
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

function detectPlayMode() {
  $('#your-words .one-word').live('click', function(){
    showAsBigWord($(this));
    startSessionViewer();
  });
}



// Hides the table variant and shows the canvas alternative.
function showCanvasAndHideTableBehaviour() {
  $('#left-container table.carpet').hide();
  $('#word').show();

  updateWord('');
}

// Returns the container for a small word.
function oneWordDiv(id, text) {
  var word = $('<div class="one-word" data-word-id="' + id + '" data-word-word="' + text + '">');

  word.append($('<div class="word" id="word_' + id + '">'));
  word.append($('<div class="word-text">').text(text));
  word.append($('<div class="svg-text">').html(drawColoredWord(text)));

  return word;
}

// Submits and draws a new word.
function newWord() {
  var text;
  var word = $('#word_word').val();

  $('#word_word').val('');
  updateTitle(word.trim());
  text = word.trim();
  addFocusTextFieldBehaviour();

  // Submit to server
  $.ajax({
    type: 'POST',
    data: { word : { word : word} },
    url: '/words',
    dataType: 'json',
    success: function(data){
      var id = data[0]['word']['id'];

      // Gameing
      var game;
      if(data[1]['game'] != null){
        game = data[1]['game'];
      }else{
        game = data[1]['new_word_game'];
      }
      updateScores(game['score']);

      // Main sign
      updateTitle('');
      updateRiddle(text);
      $('#title').show();
      updateWord(text);

      // Context
      generateWordMenu(text, id);

      // Add small sign to history
      addSignToBar($('#your-words'), text, id);

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
  detectPlayMode();
  
  showCanvasAndHideTableBehaviour();

  if($('#words').length > 0 || $('#facebook').length > 0 ){
    addRealtimeWordDrawingBehaviour();
    $('#slug-word-share').html(generateShareLink($('#word_word').val().trim()));
    // Game merge
    if(!$('#facebook').length > 0){
      setWelcomeMode();

      var speed = 314*3.14*3.14;
      setInterval('showNewRandomWord()', speed);
    }
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
