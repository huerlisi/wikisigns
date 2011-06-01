// Returns a timestamp string, used for ajax requests.
function timeStamp() {
  var time = new Date().getTime();
  return time.toString();
}

// Sharing
// =======
// Adds the tweet or facebook-like button for resharing.
function generateShareLink(slug) {
  var link = "";
  var url = 'http://' + window.location.hostname + '/word/' + slug;

  link = '<fb:like layout="button_count" href="http://' + window.location.hostname + '/word/' + slug + '"></fb:like>';
  link += '<br/>';
  link += '<fb:send href="http://' + window.location.hostname + '/word/' + slug + '"></fb:send>';
  link += '<br/>';
  link += '<div class="social-media-links"><a class="twitter-share-button" href="http://twitter.com/share" data-url="' + url + '">Tweet</a></div>';
  link += '<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>';

  return link;
}

// Redraws after every key type the word.
function addRealtimeWordDrawingBehaviour() {
  $('#word_word').keyup(function(event){
    abortHelp();
    clearSessionViewerIntervals();
    showPlayAndHidePauseButton();
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

// Hides the table variant and shows the canvas alternative.
function showCanvasAndHideTableBehaviour() {
  $('#left-container table.carpet').hide();
  $('#word').show();
  drawWordAsImage('word', '');
}

// Draw a new word and submit it to the data base.
function addSessionWordsBehaviour(){
  $('#center-container').css('display', 'block');

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

// Returns the container for a small word.
function oneWordDiv(id, text, random, prefix) {
  if(random == null) random = false;
  if(prefix == null) prefix = '';
  return '<div class="one-word" data-random-word="' + random + '" data-word-id="' + id + '" data-word-word="' + text + '"><div id="word_' + prefix + id + '" class="word"></div><div class="word-text">'+ text +'</div><div class="svg-text">' + drawColoredWord(text) + '</div></div>';
}

// Submits and draws a new word.
function newWord() {
  var next_word_id = $('#next_word_id') ? $('#next_word_id').val() : null;
  var text;
  var word = $('#word_word').val();

  $('#word_word').val('');
  $('#title-inserted').html(drawColoredWord(word.trim()));
  text = $('#title-inserted').text().trim();
  addFocusTextFieldBehaviour();


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

      $('#word').children().remove();
      updateScores(game['score']);
      $('#title span').remove();
      $('#title').html(drawColoredWord(text));
      $('#title').show();
      $('#title-inserted span').remove();
      drawWordAsImage('word', text);
      $('#your-words').append(oneWordDiv(id, text, false));
      drawWordAsImage('word_' + id, text, 100);
      var one_word = $('#your-words .one-word:last-child');
      startSessionViewer();
      one_word.click(function(){
        showAsBigWord(one_word, true);
      });
      $('#word-menu').hide();
      $('#word-menu *').remove();
      $('#word-menu').append(generateShareLink(text)).append(createLinkToPNGDownload(text)).append(createPublishToFacebookLink(id)).fadeIn(250, function(){
        FB.XFBML.parse();
      });
      $('#your-words').animate({scrollTop: $('#your-words')[0].scrollHeight});

      if($('.twitter-user').length>0){
        $('a.twitter-share-button').each(function(){
          var tweet_button = new twttr.TweetButton( $(this).get(0) );
          tweet_button.render();
        });
      }

      $('#next_word_id').remove();
      $('#new_word').prepend('<input id="next_word_id" type="hidden" value="' + id + '" />');
      $('#session-share-link').show();
    }
  })
}

// Sets focus to the input field.
function addFocusTextFieldBehaviour() {
  $('#word_word').focus().select();
}

// Creates a div with a link to the PNG of the word id.
function createLinkToPNGDownload(word) {
  return '<div class="png-download-link"><a href="/word/' + word +'.png?download=true">Als Bild speichern</a></div>'
}

function createPublishToFacebookLink(id) {
  return '<div class="png-download-link"><a class="publish-word-to-facebook" href="/words/' + id +'/publish" data-word-id="' + id + '">Auf Facebook veröffentlichen</a></div>';
}

// Make random words clickable
function addInitialResizeBehaviour() {
  $('#random-words-container .one-word').live('click', function(){
    showAsBigWord($(this), true, true);
    $(this).fadeOut(125).remove();
  });
}

// Adds the behaviour for publishing words to facebook on links with css class publish-word-to-facebook
function addPublishWordToFacebookBehaviour() {
  $('a.publish-word-to-facebook').live('click', function(e){
    e.preventDefault();

    $.ajax({
      type: 'GET',
      url: $(this).attr('href')
    });
  })
}

// Initialize behaviours
function initializeBehaviours() {
  addFocusTextFieldBehaviour();
  addSessionWordsBehaviour();

  if($('#words').length > 0 || $('#facebook').length > 0 ){
    showCanvasAndHideTableBehaviour();
    addRealtimeWordDrawingBehaviour();
    addInitialResizeBehaviour();
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
    drawWordAsImage('word', $('#title').text());
  }

  // initialize only on /words/:id page.
  if($('#show-word').length > 0){
    addColorizeTextBehaviour();
  }
  initializeTooltips();
  addPublishWordToFacebookBehaviour();
  shareSessionLinkBehaviour();
}

// iOS detection
// Code snippet from: http://www.barklund.org/blog/2010/04/23/ipad-detection/
function isAiOS() {
  return (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/));
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
