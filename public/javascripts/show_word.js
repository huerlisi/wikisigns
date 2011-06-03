var letter_speed = 314 * 3.14;
var show_word_interval;
var shown_word;
var draw_word_interval;

function showAsBigWord(element, click_on_element) {
  if(click_on_element == null) click_on_element = false;
  $('#word_word').val('');
  $('#title-inserted span').remove();
  $('#title').show();
  original_word = element.attr('data-word-word');
  shown_word = '';
  $('#title').html(drawColoredWord(element.attr('data-word-word')));
  updateWord('');
  clearSessionViewerIntervals();

  if(click_on_element) {
    showPlayAndHidePauseButton();
    startSessionViewer();
  }else{
    setTimeout('startShowWord()', letter_speed);
  }

  $('#word-menu').hide(0, function(){
    $('#word-menu *').remove();
    $('#word-menu').append(generateShareLink(element.attr('data-word-word'))).append(createLinkToPNGDownload(element.attr('data-word-word'))).append(createPublishToFacebookLink(element.attr('data-word-id'))).fadeIn(250, function(){
      FB.XFBML.parse();
    });
  });
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
    url: '/words/random.json?time=' + timeStamp(),
    dataType: 'json',
    cache: true,
    beforeSend : function(xhr){
     xhr.setRequestHeader("Accept", "application/json");
    },
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