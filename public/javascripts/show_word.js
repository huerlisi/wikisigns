var letter_speed = 314 * 3.14;
var show_word_interval;
var shown_word;
var draw_word_interval;
var word_position;

function showAsBigWord(element) {
  // Read word params from element
  var text = element.attr('data-word-word');
  var id = element.attr('data-word-id');

  // Clear message input
  $('#word_word').val('');

  // Globals!
  original_word = text;
  shown_word = '';

  // Main sign
  updateTitle('');
  updateWord('');

  // Context
  generateWordMenu(text, id);

  clearSessionViewerIntervals();
  showPlayAndHidePauseButton();
}

function startShowWord(word) {
  shown_word = '';
  original_word = word;
  word_position = 0;

  draw_word_interval = setInterval('drawWord()', letter_speed);
}

function drawWord() {
  if(word_position < original_word.length){
    var word = original_word.slice(0, word_position + 1);

    updateTitle(word);
    updateWord(word);
    word_position++;
  }else{
    clearInterval(show_word_interval);
    clearInterval(draw_word_interval);
    setTimeout(function(){
      session_viewer_timeout = setTimeout('showSessionViewer()', letter_speed);
    }, letter_speed*2);
  }
}
