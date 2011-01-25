// Initialize behaviours
function initializeBehaviours() {
  addFocusTextFieldBehaviour();
  showCanvasAndHideTableBehaviour();
  addSessionWordsBehaviour();
}

function showCanvasAndHideTableBehaviour() {
  $('#left-container table.carpet').hide();
  $('#word').show();
  drawWord('word');
}

function addSessionWordsBehaviour(){
  $('#center-container').attr('style', 'display:block;');
  $('#new_word').submit(function(e){
    var old_drawing = $('#word').children();
    var next_word_id = $('#next_word_id') ? $('#next_word_id').val() : null;

    e.preventDefault();
    $('#title').html($('#word_word').val());
    $('#your-words').prepend(old_drawing);
    drawWord('word');
    $.ajax({
      type: 'POST',
      data: { word : { word : $('#word_word').val(), next_word : next_word_id} },
      url: '/words',
      dataType: 'json',
      success: function(data){
        $('#next_word_id').remove();
        $('#new_word').prepend('<input id="next_word_id" type="hidden" value="' + data['word']['id'] + '" />');
      }
    })
  });
}

function addFocusTextFieldBehaviour() {
  $('#word_word').focus().select();
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
