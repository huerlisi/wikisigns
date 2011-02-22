// Initialize behaviours
function initializeBehaviours() {
  addFocusTextFieldBehaviour();
  showCanvasAndHideTableBehaviour();
  addSessionWordsBehaviour();
  addRandomLatestUpdateBehaviour();
  drawLatestWords();
//  addLoginBehaviour();
}

//function addLoginBehaviour() {
//  $('#user-login').click(function(e){
//    e.preventDefault();
//    $.ajax({
//      url: '/login',
//      context: document.body,
//      success: function(){
//        $(this).addClass("done");
//      }
//    });
//  });
//}

function drawLatestWords() {
  $('#top-container').attr('style', 'height:155px;');
  $('#top-container-scroll').attr('style', 'width:1320px;');
  $('#top-container-scroll .one-word .word').each(function(){
    var word = drawWord($(this).attr('id'), $(this).next('.word-text').text().trim());

    addSmallWordAttributes(word);
    $(this).prev('table.carpet').hide();
  });
}

function addRandomLatestUpdateBehaviour() {
  window.setInterval(updateRandomLatest, 5000);
}

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
      
      var word = drawWord($(data).children('.word').attr('id'), $(data).children('.word-text').text().trim());

      addSmallWordAttributes(word);
    }
  });
}

function showCanvasAndHideTableBehaviour() {
  $('#left-container table.carpet').hide();
  $('#word').show();
  drawWord('word', $('#title').text().trim());
}

function addSessionWordsBehaviour(){
  $('#center-container').attr('style', 'display:block;');
  $('#new_word').submit(function(e){
    var next_word_id = $('#next_word_id') ? $('#next_word_id').val() : null;
    var text;
    
    e.preventDefault();
    $('#title').html($('#word_word').val());
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

        displaySessionSmallWord(drawWord('word', text).clone(), text, id);

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

function displaySessionSmallWord(word_picture, text, id){
  var share_link = generateShareLink(id);

  word_picture = addSmallWordAttributes(word_picture);
  $('#your-words').append('<div class="svg"><div class="svg-text">'+ text +'</div>'+ share_link +'</div>');
  $('#your-words .svg:last-child').prepend(word_picture);
  FB.XFBML.parse();
}

function generateShareLink(id) {
  var link = "";

  if($('.facebook-user').length>0){
    link = '<fb:share-button class="url" href="http://' + window.location.hostname + '/words/' + id + '.png&t=bla bla" />';
  }

  if($('.twitter-user').length>0){
    link = '<div class="social-media-links"><a class="twitter-share-button" href="http://twitter.com/share?url=http://' + window.location.hostname + '/words/' + id + '.png">Tweet</a></div>';
  }

  return link;
}

function addSmallWordAttributes(word_picture){
  word_picture[0].setAttribute('viewBox', '1 1 430 430');
  word_picture[0].setAttribute('width', '100');
  word_picture[0].setAttribute('height', '100');

  return word_picture;
}

function addFocusTextFieldBehaviour() {
  $('#word_word').focus().select();
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
