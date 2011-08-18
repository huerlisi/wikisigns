$(document).ready(function(){
  $('#inspiration-content .word').each(function(){
    drawInspirationWord($(this));
  });
});

function drawInspirationWord(word_div) {
  var text = word_div.children('label').text();
  var sign = word_div.children('.sign');

  drawWordAsImage(sign, text, 100);
}