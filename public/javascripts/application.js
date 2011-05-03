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

  abortHelp();
  word = $(element).children('.word-text').html().trim();
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
    abortHelp();
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


// Random words
// ============
// Draw a new word at the top of the page.
function drawLatestWords() {
  $('#random-words-container .one-word .word').each(function(){
    var text = $(this).next('.word-text').text().trim();
    var word = drawWordAsImage($(this).attr('id'), text);

    resizeWord(word, 50);
    $(this).prev('table.carpet').hide();
  });
}

// Sets the interval for new random entry at the top of the page.
function addRandomLatestUpdateBehaviour() {
  if($('#random-words-container').length > 0) window.setInterval(updateRandomLatest, 5000);
}

// Make random words clickable
function addInitialResizeBehaviour() {
  $('#random-words-container div.one-word').each(function(){
    $(this).addClass('selectable');
    $(this).click(function(){
      showSmallPictureAsBigWord(this);
    });
  });
}

// Shows a new random entry at the top of the page.
function updateRandomLatest() {
  var container = $('#random-words-container');
  var last_child = container.children('.one-word:last-child');

  $.ajax({
    type: 'GET',
    url: '/words/random?time=' + timeStamp(),
    success: function(data){
      last_child.fadeOut(125).remove();
      container.prepend(data);

      var text = $(data).children('.word-text').text().trim();
      var word = drawWordAsImage($(data).children('.word').attr('id'), text);

      resizeWord(word, 50);
      $('#random-words-container .one-word:first-child').addClass('selectable');
      $('#random-words-container .one-word:first-child').click(function(){
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

function displaySessionSmallWord(word_picture, text, id){
  var share_link = generateShareLink(text);

  word_picture = resizeWord(word_picture, 100);
  $('#your-words').append('<div class="svg selectable"><div class="word-text svg-text">'+ drawColoredWord(text) +'</div>'+ share_link +'</div>');
  $('#your-words .svg:last-child').prepend(word_picture);
  $('#your-words .svg:last-child').click(function(){
    showSmallPictureAsBigWord(this);
  });
  $('#your-words .svg:last-child').append(createLinkToPNGDownload(id));
  FB.XFBML.parse();
  $('#your-words').animate({scrollTop: $('#your-words')[0].scrollHeight});
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

// Resize word picture.
function resizeWord(word_picture, size){
  word_picture[0].setAttribute('viewBox', '1 1 430 430');
  word_picture[0].setAttribute('width', size);
  word_picture[0].setAttribute('height', size);

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
