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
  return '<a id="fb-publish-photo-on-wall" data-remote="true" href="/word/' + word + '/publish">Auf Facebook veröffentlichen</a>';
}

function generateWordMenu(text) {
  if(text != '') $('#context-menu').empty().append(createWordMenu(text));
}

function createWordMenu(text) {
    $('#context-menu').empty()
      .addClass('button-link')
      .append(createLinkToPNGDownload(text))
      .append(createPublishToFacebookLink(text))
      .append(generateShareLink(text));
}

// Containers
// ==========
var full_screen_elements;
var on_full_screen_finished;

function startFullScreen(elements, finished) {
  if ($('#full-screen').hasClass('enabled')) {
    return;
  }

  $('#full-screen').addClass('enabled');
  $('#full-screen').click(stopFullScreen);

  on_full_screen_finished = finished;
  if (elements) {
    full_screen_elements = elements;
    elements.css('z-index', 200);
    elements.css('background-color', '#2F2F2F');
    elements.css('position', 'relative');
  }
}

function stopFullScreen() {
  if (!$('#full-screen').hasClass('enabled')) {
    return;
  }

  if (full_screen_elements) {
    full_screen_elements.css('z-index', 'auto');
    full_screen_elements.css('background-color', '');
    full_screen_elements.css('position', '');
    $('#full-screen').removeClass('enabled');
  }

  if (on_full_screen_finished) on_full_screen_finished();
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
    .append(buildSmallSign(text, 100));

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
function detectPlayMode() {
  $('#side-bar .one-word').live('click', function(){
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
  // Initialize Cufon for logo font
  Cufon.replace('#wikisigns-logo h1');

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
  drawPageTitle();
}

function drawPageTitle() {
  var title = $('#page-title');
  
  if(title.length > 0){
    var text = title.text();
    
    title.html(drawColoredWord(text));
  }
}

// iOS detection
// Code snippet from: http://www.barklund.org/blog/2010/04/23/ipad-detection/
function isAiOS() {
  return (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/));
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
