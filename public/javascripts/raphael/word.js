var canvas_width = 424;
var canvas_height = 424;

var colors = new Array(4);

colors[0] = new Array(4);
colors[0][0] = '#b392d8';
colors[0][1] = '#1f51a8';
colors[0][2] = '#565f5e';
colors[0][3] = '#60FF87';

colors[1] = new Array(4);
colors[1][0] = 'none';//'#b392d8'
colors[1][1] = '#49c8fa';
colors[1][2] = '#565f5e';
colors[1][3] = 'none';

colors[2] = new Array(4);
colors[2][0] = 'none';
colors[2][1] = '#e6437f';
colors[2][2] = '#574c48';
colors[2][3] = '#e6c949';

colors[3] = new Array(4);
colors[3][0] = '#FF8F35';
colors[3][1] = '#1f51a8';
colors[3][2] = '#FFF82A';
colors[3][3] = '#60FF87';


var letters = new Array(4);

letters[0] = new Array(4);
letters[0][0] = 'z';
letters[0][1] = 't';
letters[0][2] = 'j';
letters[0][3] = 'f';

letters[1] = new Array(4);
letters[1][0] = 'c';
letters[1][1] = 'h';
letters[1][2] = new Array(2);
letters[1][2][0] = 'i';
letters[1][2][1] = 'y';
letters[1][3] = '';

letters[2] = new Array(4);
letters[2][0] = '';
letters[2][1] = new Array(2);
letters[2][1][0] = 'd';
letters[2][1][1] = 'm';
letters[2][2] = new Array(5);
letters[2][2][0] = 'k';
letters[2][2][1] = 's';
letters[2][2][2] = 'v';
letters[2][2][3] = 'l';
letters[2][2][4] = 'r';
letters[2][3] = new Array(2);
letters[2][3][0] = 'b';
letters[2][3][1] = 'n';

letters[3] = new Array(4);
letters[3][0] = new Array(3);
letters[3][0][0] = 'e';
letters[3][0][1] = 'w';
letters[3][0][2] = 'x';
letters[3][1] = 'a';
letters[3][2] = new Array(3);
letters[3][2][0] = 'o';
letters[3][2][1] = 'g';
letters[3][2][2] = 'q';
letters[3][3] = 'u';

function drawWord() {
  var circle_dimension = 95;
  var margin = 12;
  var space = 7;
  var word = $('#title').text().trim();
  var paper = Raphael(document.getElementById('word'), canvas_width, canvas_height);

  for(var y = 0; y < 4; y++){
    for(var x = 0; x < 4; x++){
      var space_x = x * circle_dimension + space * x;
      var space_y = y * circle_dimension + space * y;
      var block_color = blockColor(word, letters[y][x], colors[y][x]);
      var point_color = pointColor(block_color);
      var point_width = pointWidth(block_color);
      var block = paper.rect(margin + space_x, margin + space_y, circle_dimension, circle_dimension, 10);
      var point = paper.circle(margin + circle_dimension/2 + space_x, margin + circle_dimension/2 + space_y, 10);
      
      block.attr({fill: block_color, stroke: 'none'});
      point.attr({fill: 'none', stroke: point_color, 'stroke-width': point_width})
    }
  }
  if(hasALetterP(word)){
    var letter_p = paper.circle(canvas_width/2, canvas_height/2, 10);
    letter_p.attr({fill: 'none', stroke: '#000000', 'stroke-width': point_width})
  }
}

function hasALetterP(word) {
  if(word.toLowerCase().indexOf('p') != -1) {
    return true
  }else{
    return false;
  }
}

function blockColor(word, letter, color) {
  var block_color = 'none';
  console.log(color);
  if(letter.constructor == (new Array).constructor){
    for(var i = 0;i<letter.length;i++){
      if(word.indexOf(letter[1]) != -1){
        block_color = color;
      }
    }
  }else{
    if(word.indexOf(letter) != -1){
      block_color = color;
    }
  }

  return block_color;
}

function pointColor(color) {
  if(color == 'none'){
    return '#000000';
  }
  return '#FFFFFF';
}

function pointWidth(color) {
  if(color == 'none'){
    return 2;
  }
  return 4;
}