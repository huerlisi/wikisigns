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
  return '<div class="button-link"><a href="/word/' + word +'.png?download=true">Als Bild speichern</a></div>'
}

function createPublishToFacebookLink(id) {
  return '<div class="button-link"><a data-remote="true" href="/words/' + id +'/publish">Auf Facebook veröffentlichen</a></div>';
}

function generateWordMenu(text, id) {
  $('#context-menu').empty()
    .append(createLinkToPNGDownload(text))
    .append(generateShareLink(text))
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
function addSignToBar(text, id) {
  var bar = $('#side-bar');

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
  $('.one-word').live('click', function(){
    showAsBigWord($(this));
    startSessionViewer();
  });
}



// Hides the table variant and shows the canvas alternative.
function showCanvasAndHideTableBehaviour() {
  $('table.carpet').hide();
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
  // Mode detection
  detectGameMode();
  detectPlayMode();
  
  showCanvasAndHideTableBehaviour();

  if($('#words').length > 0 || $('#facebook').length > 0 ){
    $('#slug-word-share').html(generateShareLink($('#word_word').val().trim()));
  }

  $('#game-menu').show();

  if($('#word.svg').length > 0) {
    updateWord($('#title').text());
  }

  // initialize only on /words/:id page.
  addColorizeTextBehaviour();
  initializeTooltips();
  shareSessionLinkBehaviour();
}

// iOS detection
// Code snippet from: http://www.barklund.org/blog/2010/04/23/ipad-detection/
function isAiOS() {
  return (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/));
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
