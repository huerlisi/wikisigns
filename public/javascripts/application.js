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
  return '<a id="photo-download-link" href="/word/' + word +'.png?download=true">Als Bild speichern</a>'
}

function createPublishToFacebookLink(word) {
  return '<a id="fb-publish-photo-on-wall" data-remote="true" href="/words/' + word +'/publish">Auf Facebook veröffentlichen</a>';
}

function generateWordMenu(text) {
  if(text != ''){
    $('#context-menu').empty()
      .append(createWordMenu(text))
      /*.append(createLinkToPNGDownload(text))
      .append(generateShareLink(text))
      .append(createPublishToFacebookLink(text));*/
  }
}

function createWordMenu(text) {
  return '<a href="#" class="publish-menu" data-text="' + text +'">Veröffentlichen</a>';
}

function publishMenuBehaviour() {
  $('.publish-menu').live('click', function(){
    var text = $(this).attr('data-text');

    $('#context-menu').empty()
      .append(createLinkToPNGDownload(text))
      .append(generateShareLink(text))
      .append(createPublishToFacebookLink(text));
  });
}

// Containers
// ==========
function startFullScreen() {
  if ($('#container').hasClass('fullscreen')) {
    return;
  }

  $('#container').addClass('fullscreen');
  $('#container > div >div:not(#main-sign)').animate({opacity: 0.1}, 3000);
}

function stopFullScreen() {
  if (!$('#container').hasClass('fullscreen')) {
    return;
  }

  $('#container').removeClass('fullscreen');
  $('#container > div >div:not(#main-sign)').animate({opacity: 1}, 1000);
}


// Main Sign
// =========

// Update Main Title by smooth fade out/in
function updateMainTitle(text) {
  var title = $('#main-title');

  title.animate({opacity: 0}, 1000, function() {
    title.html(drawColoredWord(text));
    title.animate({opacity: 1}, 2000);
  });
}

function updateTitle(text) {
  var title = $('#title');
  var current_text = title.text();

  if (text.match("^" + current_text) == current_text) {
    // Only append if text starts with current_text
    var new_text = text.replace(new RegExp("^" + current_text), "");
    appendToTitle(new_text);
  } else {
    $('#title').html(drawColoredWord(text));
  }
}

// Append to title by fading in
function appendToTitle(text) {
  var title = $('#title');
  
  var letter = $(drawColoredWord(text));
  letter.css('opacity', 0);
  $('#title').append(letter);

  letter.animate({opacity: 1}, 1000);
}

// Delete from title by fading out
function deleteFromTitle(index) {
  var title = $('#title');
  
  var letter = title.find(":nth-child(" + index + ")");
  letter.animate({opacity: 0}, 500, function() { letter.remove(); });
}

function updateWord(text) {
  drawWordAsImage($('#word'), text);
}

// Bars
// ====
// Returns the container for a small word.
function buildSmallSign(text, dimension) {
  // Prepare container
  var sign  = $('<div class="one-word" data-word-word="' + text + '">');
  var image = $('<div class="word">');
  sign.append(image);

  // Fill in content
  drawWordAsImage(image, text, dimension);

  // Draw sign
  return sign;
}

function replaceSmallSign(index, text, dimension) {
  var sign = $('#sign-' + index);

  sign.animate({opacity: 0}, 1500, function() {
    sign.html(buildSmallSign(text, dimension));
  }).delay(1000).animate({opacity: 1}, 1500);
}

function addSideBarSign(text) {
  var bar = $('#side-bar');

  // Create element
  var sign = $('<div class="sign">')
    .append(buildSmallSign(text));

  // Add to bar
  bar.append(sign);

  // Scroll to make new sign visible
  bar.animate({scrollTop: bar[0].scrollHeight});
}

// Modes
// =====
var stopCurrentMode = function() {};

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

    startShowWord(word, afterShowSmallSign);
  });
}

var afterShowSmallSign = function() {};


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

  publishMenuBehaviour();

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
