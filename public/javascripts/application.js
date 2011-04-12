var text_input = $('#word_word');

// Initialize behaviours
function initializeBehaviours() {
  addFocusTextFieldBehaviour();
  addSessionWordsBehaviour();

  // initialize only on /words/new page.
  if($('#words').length > 0 || $('#word.svg').length > 0 ){
    addRandomLatestUpdateBehaviour();
    drawLatestWords();
    showCanvasAndHideTableBehaviour();
    addRealtimeWordDrawingBehaviour();
    addInitialResizeBehaviour();
  }

  // initialize only on /words/:id page.
  if($('#show-word').length > 0){
    addColorizeTextBehaviour();
  }
}

// Adds a mouseover effect to the latest words.
function addInitialResizeBehaviour() {
  $('#top-container-scroll div.one-word').each(function(){
    $(this).addClass('selectable');
    $(this).click(function(){
      showSmallPictureAsBigWord(this);
    });
  });
}

// Shows a small word picture in the big main word.
function showSmallPictureAsBigWord(element) {
  var word = '';

  // Read the word from within the span tags.
  $(element).children('.word-text').children('span').each(function(){
    word += $(this).html().trim();
  });

  text_input.val(word);
  $('#word svg').remove();
  drawWordAsImage('word', word);
  $('#title').html(drawColoredWord(text_input.val().trim()));
}

//
function addRealtimeWordDrawingBehaviour() {
  text_input.keyup(function(event){
    if(event.keyCode != 13) {
      $('#word').children().remove();
      drawWordAsImage('word', $(this).val().trim());
      $('#title').html(drawColoredWord($(this).val().trim()));

      if($(this).val().indexOf(' ', 0) > -1) {
        newWord();
      }
    }
  });
}

// Colorizes the text on the show word page.
function addColorizeTextBehaviour() {
  var text_field = $('#title');

  text_field.html(drawColoredWord(text_field.text().trim()));
}

// Draw a new word at the top of the page.
function drawLatestWords() {
  $('#top-container').attr('style', 'height:155px;');
  $('#top-container-scroll').attr('style', 'width:1320px;');
  $('#top-container-scroll .one-word .word').each(function(){
    var text = $(this).next('.word-text').text().trim();
    var word = drawWordAsImage($(this).attr('id'), text);

    addSmallWordAttributes(word);
    $(this).prev('table.carpet').hide();
    $(this).next('.word-text').html(drawColoredWord(text));
  });
}

// Sets the interval for new random entry at the top of the page.
function addRandomLatestUpdateBehaviour() {
  window.setInterval(updateRandomLatest, 5000);
}

// Shows a new random entry at the top of the page.
function updateRandomLatest() {
  var container = $('#top-container-scroll');
  var last_child = container.children('.one-word:last-child');

  $.ajax({
    type: 'GET',
    url: '/words/random',
    success: function(data){
      last_child.fadeOut(125);
      last_child.remove();
      container.prepend(data);

      var text = $(data).children('.word-text').text().trim();
      var word = drawWordAsImage($(data).children('.word').attr('id'), text);

      addSmallWordAttributes(word);
      $('#top-container-scroll .one-word:first-child .word-text').html(drawColoredWord(text));
      $('#top-container-scroll .one-word:first-child').addClass('selectable');
      $('#top-container-scroll .one-word:first-child').click(function(){
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
  $('#title').html(drawColoredWord(text_input.val().trim()));
}

// Draw a new word and submit it to the data base.
function addSessionWordsBehaviour(){
  $('#center-container').attr('style', 'display:block;');
  $('#new_word').submit(function(e){
    e.preventDefault();
    newWord();
  });
}

// Submits and draws a new word.
function newWord() {
  var next_word_id = $('#next_word_id') ? $('#next_word_id').val() : null;
  var text;

  $('#title').html(drawColoredWord(text_input.val().trim()));
  text = $('#title').text().trim();
  addFocusTextFieldBehaviour();
  $('#word').children().remove();


  $.ajax({
    type: 'POST',
    data: { word : { word : text_input.val(), next_word : next_word_id} },
    url: '/words',
    dataType: 'json',
    success: function(data){
      var id = data['word']['id'];

      displaySessionSmallWord(drawWordAsImage('word', text).clone(), text, id);

      if($('.twitter-user').length>0){
        $('a.twitter-share-button').each(function(){
          var tweet_button = new twttr.TweetButton( $( this ).get( 0 ) );
          tweet_button.render();
        });
      }

      $('#next_word_id').remove();
      $('#new_word').prepend('<input id="next_word_id" type="hidden" value="' + id + '" />');
    }
  })
}

// Modifies the word picture attributes for the small word picture.
function addSmallWordAttributes(word_picture){
  word_picture[0].setAttribute('viewBox', '1 1 430 430');
  word_picture[0].setAttribute('width', '100');
  word_picture[0].setAttribute('height', '100');

  return word_picture;
}

// Sets focus to the input field.
function addFocusTextFieldBehaviour() {
  text_input.focus().select();
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
