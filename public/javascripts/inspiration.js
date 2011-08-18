$(document).ready(function(){
  $('#inspiration-content .word').each(function(){
    var text = $(this).children('label').text();
    var sign = $(this).children('.sign');

    drawWordAsImage(sign, text, 100);
  });
});