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
  }

  // initialize only on /words/:id page.
  if($('#show-word').length > 0){
    addColorizeTextBehaviour();
  }
}

//
function addRealtimeWordDrawingBehaviour() {
  $('#word_word').keyup(function(event){
    //console.log('keypress on: ' + $(this).val().trim());
    $('#word').children().remove();
    drawWordAsImage('word', $(this).val().trim());
    $('#title').html(drawColoredWord($(this).val().trim()));
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
    }
  });
}

// Hides the table variant and shows the canvas alternative.
function showCanvasAndHideTableBehaviour() {
  $('#left-container table.carpet').hide();
  $('#word').show();
  drawWordAsImage('word', $('#title').text().trim());
  $('#title').html(drawColoredWord($('#word_word').val().trim()));
}

// Draw a new word and submit it to the data base.
function addSessionWordsBehaviour(){
  $('#center-container').attr('style', 'display:block;');
  $('#new_word').submit(function(e){
    var next_word_id = $('#next_word_id') ? $('#next_word_id').val() : null;
    var text;
    
    e.preventDefault();
    $('#title').html(drawColoredWord($('#word_word').val().trim()));
    text = $('#title').text().trim();
    addFocusTextFieldBehaviour();
    $('#word').children().remove();


    $.ajax({
      type: 'POST',
      data: { word : { word : $('#word_word').val(), next_word : next_word_id} },
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
  });
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
  $('#word_word').focus().select();
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
