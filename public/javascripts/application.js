var text_input = $('#word_word');

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

  if($('.facebook-user').length>0){
    link = '<fb:like layout="button_count" href="http://' + window.location.hostname + '/word/' + slug + '"></fb:like>';
  }

  if($('.twitter-user').length>0){
    var url = 'http://' + window.location.hostname + '/word/' + slug;

    link = '<div class="social-media-links"><a class="twitter-share-button" href="http://twitter.com/share" data-url="' + url + '">Tweet</a></div>';
    link += '<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>';
  }

  return link;
}

function addReshareBehaviour() {
  $('#slug-word-share').html(generateShareLink(text_input.val().trim()));
}


// Shows a small word picture in the big main word.
function showSmallPictureAsBigWord(element) {
  var word = '';

  random_word = $(element).attr('data-random-word');
  abortHelp();
  word = $(element).attr('data-word-word');
  text_input.attr('data-word-id', $(element).attr('data-word-id'));
  $('#word svg').remove();
  drawWordAsImage($('#word'), word);
  $('#title-inserted').html(drawColoredWord(text_input.val()));
  $('#title span').hide(125, function(){
    $(this).remove();
  });
  $('#title span').hide().remove();
  original_word = word;
  clearInterval(small_picture_help_interval);
  resetGame(original_word, text_input.attr('data-word-id'), small_picture_help_interval_time);
}

//
function addRealtimeWordDrawingBehaviour() {
  text_input.keyup(function(event){
    abortHelp();
    clearSessionViewerIntervals();
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

// Shows a new random entry at the top of the page.
function updateRandomLatest() {
  var container = $('#random-words-container');
  var last_child = container.children('.one-word').eq(Math.floor(Math.random()*11));

  $.ajax({
    type: 'GET',
    url: '/words/random?time=' + timeStamp(),
    dataType: 'json',
    beforeSend : function(xhr){
      xhr.setRequestHeader("Accept", "application/json");
    },
    success: function(data){

      last_child.fadeOut(1000);
      last_child.replaceWith($(oneWordDiv(data['word']['id'], data['word']['word'], true)).fadeIn(1000));
      var word = drawWordAsImage('word_' + data['word']['id'], data['word']['word']);
      //resizeWord(word, 50);

    }
  });
}

// Hides the table variant and shows the canvas alternative.
function showCanvasAndHideTableBehaviour() {
  $('#left-container table.carpet').hide();
  $('#word').show();
  drawWordAsImage('word', $('#title').text().trim());
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
  var word = text_input.val();

  text_input.val('');
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
        $('#title').html(drawColoredWord(one_word.attr('data-word-word')));
        $('#word svg').remove();
        drawWordAsImage('word', one_word.attr('data-word-word'));
      });
      one_word.append(generateShareLink(text));
      FB.XFBML.parse();
      one_word.append(createLinkToPNGDownload(id));
      $('#your-words').animate({scrollTop: $('#your-words')[0].scrollHeight});

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

// Sets focus to the input field.
function addFocusTextFieldBehaviour() {
  text_input.focus().select();
}

// Creates a div with a link to the PNG of the word id.
function createLinkToPNGDownload(id) {
  return '<div class="png-download-link"><a href="/words/' + id +'/svg.png?download=true">Als Bild speichern</a></div>'
}

// Make random words clickable
function addInitialResizeBehaviour() {
  $('#random-words-container .one-word').live('click', function(){
    showSmallPictureAsBigWord(this);
    $(this).fadeOut(125).remove();
  });
}

// Initialize behaviours
function initializeBehaviours() {
  addFocusTextFieldBehaviour();
  addSessionWordsBehaviour();

  if($('#words').length > 0 || $('#word.svg').length > 0 || $('#facebook').length > 0 ){
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
  initializeTooltips();
}

// iOS detection
// Code snippet from: http://www.barklund.org/blog/2010/04/23/ipad-detection/
function isAiOS() {
  return (navigator && navigator.platform && navigator.platform.match(/^(iPad|iPod|iPhone)$/));
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
