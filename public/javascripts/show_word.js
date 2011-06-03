var letter_speed = 314 * 3.14;
var show_word_interval;
var shown_word;
var draw_word_interval;

function showAsBigWord(element) {
  // Read word params from element
  var text = element.attr('data-word-word');
  var id = element.attr('data-word-id');

  // Clear message input
  $('#word_word').val('');

  // Globals!
  original_word = text;
  shown_word = '';

  // Update texts
  updateWord('');
  updateTitle('');
  $('#title').show();
  $('#title').html(drawColoredWord(text));

  clearSessionViewerIntervals();

  showPlayAndHidePauseButton();

  // Prepare word menu
  generateWordMenu(text, id);
}

function startShowWord() {
  draw_word_interval = setInterval('drawWord()', letter_speed);
}

function drawWord() {
  if($('#title span').length>0){
    $('#title span:first-child').fadeOut(125, function(){
      var word = $(this);
      shown_word += word.text().trim();

      $('#title-inserted').append(word);
      word.show(125, function(){
        updateWord(shown_word);
      });
    });
  }else{
    clearInterval(show_word_interval);
    clearInterval(draw_word_interval);
    setTimeout(function(){
      session_viewer_timeout = setTimeout('showSessionViewer()', letter_speed);
    }, letter_speed*2);
  }
}

function showNewRandomWord(speed) {
  $.ajax({
    type: 'GET',
    url: '/words/random.json',
    dataType: 'json',
    cache: false,
    success: function(data){
      $('#random-words-container').append(oneWordDiv(data['word']['id'], data['word']['word'], false, 'random_'));
      drawWordAsImage('word_random_' + data['word']['id'], data['word']['word'], 100);
      $('#random-words-container').animate({scrollTop: $('#random-words-container')[0].scrollHeight}, function(){
        setTimeout(function(){
          showNewRandomWord(speed);
        }, speed);
      });
    }
  });
}