// Initialize behaviours
function initializeBehaviours() {
  addFocusTextFieldBehaviour();
  showCanvasAndHideTableBehaviour();
  addSessionWordsBehaviour();
  addRandomLatestUpdateBehaviour();
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
    }
  });
}

function showCanvasAndHideTableBehaviour() {
  $('#left-container table.carpet').hide();
  $('#word').show();
  drawWord('word');
}

function addSessionWordsBehaviour(){
  $('#center-container').attr('style', 'display:block;');
  $('#new_word').submit(function(e){
    var next_word_id = $('#next_word_id') ? $('#next_word_id').val() : null;

    e.preventDefault();
    $('#title').html($('#word_word').val());

    if(next_word_id) {
      var cloned_word = $('#word').children().clone();

      $('#word').children().remove();
      drawWord('word');
      displaySessionSmallWord(cloned_word, $('#title').text().trim())
    }else{
      $('#word').children().remove();
      var dump = drawWord('word').clone();
      
      displaySessionSmallWord(dump, $('#title').text().trim())
    }

    $.ajax({
      type: 'POST',
      data: { word : { word : $('#word_word').val(), next_word : next_word_id} },
      url: '/words',
      dataType: 'json',
      success: function(data){
        $('#next_word_id').remove();
        $('#new_word').prepend('<input id="next_word_id" type="hidden" value="' + data['word']['id'] + '" />');
        addFocusTextFieldBehaviour();
      }
    })
  });
}

function displaySessionSmallWord(word_picture, text){
  word_picture[0].setAttribute('viewBox', '1 1 430 430');
  word_picture[0].setAttribute('width', '100');
  word_picture[0].setAttribute('height', '100');
  $('#your-words').append('<div class="svg"><div class="svg-text">'+ text +'</div></div>');
  $('#your-words .svg:last-child').prepend(word_picture);
}

function addFocusTextFieldBehaviour() {
  $('#word_word').focus().select();
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
