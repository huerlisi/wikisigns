var letter_speed = 314 * 3.14;
var show_word_interval;
var show_word_counter;
var shown_word;

function showAsBigWord(element, click_on_element) {
  if(click_on_element == null) click_on_element = false;
  text_input.val('');
  $('#title-inserted span').remove();
  $('#title').show();
  original_word = element.attr('data-word-word');
  shown_word = '';
  $('#title').html(drawColoredWord(element.attr('data-word-word')));
  $('#word svg').remove();
  drawWordAsImage('word', element.attr('data-word-word'));
  clearSessionViewerIntervals();

  if(click_on_element) {
    showPlayAndHidePauseButton();
    startSessionViewer();
  }else{
    setTimeout('startShowWord()', letter_speed);
  }

  $('#word-menu').hide();
  $('#word-menu *').remove();
  $('#word-menu').append(generateShareLink(original_word)).append(createLinkToPNGDownload(element.attr('data-word-id'))).fadeIn(250);
  FB.XFBML.parse();
}

function startShowWord() {
  $('#word svg').remove();
  drawWordAsImage('word', '');
  show_word_counter = 1;
  setTimeout('drawWord()', letter_speed);
  //session_viewer_timeout = setTimeout('showSessionViewer()', timeout);
}

function drawWord() {
  if($('#title span').length>0){
    $('#title span:first-child').fadeOut(125, function(){
      var word = $(this);
      shown_word += word.text().trim();

      $('#title-inserted').append(word);
      word.show(125, function(){
        $('#word svg').remove();
        drawWordAsImage('word', shown_word);
        show_word_counter++;
        setTimeout('drawWord()', letter_speed);
      });
    });
  }else{
    $('#word svg').remove();
    drawWordAsImage('word', '');
    clearInterval(show_word_interval);
    session_viewer_timeout = setTimeout('showSessionViewer()', letter_speed);
  }
}

function showNewRandomWord(speed) {
  $.ajax({
    type: 'GET',
    url: '/words/random.json?time=' + timeStamp(),
    dataType: 'json',
    cache: true,
    beforeSend : function(xhr){
     xhr.setRequestHeader("Accept", "application/json");
    },
    success: function(data){
      console.log(data['word']['word']);
      $('#random-words-container').append(oneWordDiv(data['word']['id'], data['word']['word'], false, 'random_'));
      drawWordAsImage('word_random_' + data['word']['id'], data['word']['word'], 100);
      setTimeout(function(){
        showNewRandomWord(speed);
      }, speed);
    }
  });
}