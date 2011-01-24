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
    e.preventDefault();
    $('#title').html($('#word_word').val());
    var old_drawing = $('#word').children();
    $('#your-words').prepend(old_drawing);
    drawWord('word');
    $.ajax({
      type: 'POST',
      url: '/words/new',
      success: alert('updated')
    })
  });
}

function addFocusTextFieldBehaviour() {
  $('#word_word').focus().select();
}

// Loads functions after DOM is ready
$(document).ready(initializeBehaviours);
