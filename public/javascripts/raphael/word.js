var canvas_width = 424;
var canvas_height = 424;

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
letters[1][3] = null;

letters[2] = new Array(4);
letters[2][0] = null;
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

function drawWord(id) {
  var circle_dimension = 95;
  var margin = 8;
  var space = 7;
  var word = $('#title').text().trim();
  var paper_space = 7;
  var paper = Raphael(document.getElementById(id), canvas_width, canvas_height);

  // Drop shadow for carpet
  var paper_shadow = paper.rect(2, 2, canvas_width - paper_space, canvas_width - paper_space, 10);
  paper_shadow.attr({stroke: "none", fill: "#555", translation: "2,2"});
  paper_shadow.blur(2);

  // The carpet itself
  var paper_content = paper.rect(2, 2, canvas_width - paper_space, canvas_width - paper_space, 10);
  paper_content.attr({stroke: "none", fill: "#efefef"});

  var path_x, path_y;
  var point_x, point_y;

  // Paint all 4x4 blocks
  for(var y = 0; y < 4; y++){
    for(var x = 0; x < 4; x++){
      var space_x = x * circle_dimension + space * x;
      var space_y = y * circle_dimension + space * y;
      var block_color = blockColor(word, letters[y][x], coord2color(y, x));
      var point_color = pointColor(block_color);
      var point_width = pointWidth(block_color);
      var shadow;

      // Inner Circle
      point_x = margin + circle_dimension/2 + space_x;
      point_y = margin + circle_dimension/2 + space_y;
      var point = paper.circle(point_x, point_y, 5);
      point.attr({fill: 'none', stroke: point_color, 'stroke-width': point_width})
      point.toBack();

      if (block_color != 'none') {
        // Block
        var block = paper.rect(margin + space_x, margin + space_y, circle_dimension, circle_dimension, 10);
        block.attr({fill: block_color, stroke: 'none'});

        point.attr({fill: 'none', stroke: point_color, 'stroke-width': point_width})
        point.toBack();
        block.toBack();

        // Drop shadow
        shadow = paper.rect(margin + space_x, margin + space_y, circle_dimension, circle_dimension, 10);
        shadow.attr({stroke: "none", fill: "gray", translation: "2,2"});
        shadow.blur(2);
        shadow.toBack();

        // Path
        if(path_x != undefined && path_y != undefined){
          var path = paper.path("M"+path_x+" "+path_y+"L"+point_x+" "+point_y);
          path.attr({stroke: point_color, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.75});
          path.toFront();
        }

        // Save coords for path
        path_x = point_x;
        path_y = point_y;
      }
    }
  }
  // Paint P
  if(hasALetterP(word)){
    var letter_p = paper.circle(canvas_width/2, canvas_height/2, 10);
    letter_p.attr({fill: 'none', stroke: 'white', 'stroke-width': point_width})
  }

  paper_content.toBack();
  paper_shadow.toBack();
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

  if(letter == null) {
    return block_color;
  }

  if(letter.constructor == (new Array).constructor){
    for(var i = 0;i<letter.length;i++){
      if(word.indexOf(letter[i]) > -1){
        block_color = color;
      }
    }
  }else{
    if(word.indexOf(letter) > -1){
      block_color = color;
    }
  }
  return block_color;
}

function pointColor(color) {
  if(color == 'none'){
    return 'gray';
  }
  return 'white';
}

function pointWidth(color) {
  if(color == 'none'){
    return 1;
  }
  return 2;
}


function coord2index(x, y) {
  return 4 * y + (3 - x);
}

function digit(index) {
  return Math.floor(Math.pow(10, index + 1) /17) % 10;
}

function coord2digit(x, y) {
  return digit(coord2index(x, y));
}

var colors = Array(
 '#FF8F35', // 0
 '#565f5e', // 1
 '#1f51a8', // 2
 '#e6437f', // 3
 '#574c48', // 4
 '#49c8fa', // 5
 '#e6c949', // 6
 '#60FF87', // 7
 '#b392d8', // 8
 '#FFF82A' // 9
)

function coord2color(x, y) {
  return colors[coord2digit(x, y)];
}
