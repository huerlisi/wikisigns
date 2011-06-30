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

function createPublishToFacebookLink(word) {
  return '<div class="button-link"><a data-remote="true" href="/words/' + word +'/publish">Auf Facebook veröffentlichen</a></div>';
}

function generateWordMenu(text) {
  $('#context-menu').empty()
    .append(createLinkToPNGDownload(text))
    .append(generateShareLink(text))
    .append(createPublishToFacebookLink(text));
}

// Containers
// ==========
function startFullScreen() {
  $('#container > div >div:not(#main-sign)').animate({opacity: 0.1}, 3000);
  $('#container').addClass('fullscreen');
}

function stopFullScreen() {
  $('#container > div >div:not(#main-sign)').animate({opacity: 1}, 1000);
  $('#container').removeClass('fullscreen');
}


// Main Sign
// =========
function updateMainTitle(text) {
  // Guard as we bail on null etc.
  if (!text) {
    return;
  };

  // Hide
  var title = $('#main-title');
  title.animate({opacity: 0}, 1000, function() {
    title.html(drawColoredWord(text));

    title.animate({opacity: 1}, 2000);
  });
}

function updateTitle(text) {
  // Guard as we bail on null etc.
  if (!text) {
    return;
  };

  $('#title').html(drawColoredWord(text));
}

function updateWord(text) {
  // Guard as we bail on null etc.
  if (!text) {
    return;
  };

  drawWordAsImage($('#word'), text);
}

// Bars
// ====
// Returns the container for a small word.
function buildSideBarSign(text) {
  // Prepare container
  var sign  = $('<div class="one-word" data-word-word="' + text + '">');
  var image = $('<div class="word">');
  sign.append(image);

  // Fill in content
  drawWordAsImage(image, text, 100);

  // Draw sign
  return sign;
}

function replaceSideBarSign(index, text) {
  // Guard as we bail on null etc.
  if (!text) {
    return;
  };

  var sign = $('#sign-' + index);

  sign.animate({opacity: 0}, 1500, function() {
    sign.html(buildSideBarSign(text));
  }).delay(1000).animate({opacity: 1}, 1500);
}

function addSideBarSign(text) {
  var bar = $('#side-bar');

  // Create element
  var sign = $('<div class="sign">')
    .append(buildSideBarSign(text));

  // Add to bar
  bar.append(sign);

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
}

function detectPlayMode() {
  $('.one-word').live('click', function(){
    var word = $(this).data('word-word');

    showAsBigWord(word);
    startShowWord(word);
  });
}


// Colorizes the text on the show word page.
function addColorizeTextBehaviour() {
  updateTitle($('#title').text());
}

// Initialize behaviours
function initializeBehaviours() {
  // Mode detection
  detectPlayMode();
  
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
