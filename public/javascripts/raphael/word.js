var canvas_width = 424;
var canvas_height = 424;

var letters = new Array(4);

letters[0] = new Array(4);
letters[0][0] = new Array(12);
letters[0][0][0] = 'z';
letters[0][0][1] = '28';
letters[0][0][2] = '48';
letters[0][0][3] = '58';
letters[0][0][4] = '68';
letters[0][0][5] = '78';
letters[0][0][6] = '80';
letters[0][0][7] = '81';
letters[0][0][8] = '82';
letters[0][0][9] = '83';
letters[0][0][10] = '87';
letters[0][0][11] = '88';
letters[0][0][12] = '98';
letters[0][1] = new Array(11);
letters[0][1][0] = 't';
letters[0][1][1] = '@';
letters[0][1][2] = '12';
letters[0][1][3] = '21';
letters[0][1][4] = '22';
letters[0][1][5] = '25';
letters[0][1][6] = '26';
letters[0][1][7] = '27';
letters[0][1][8] = '28';
letters[0][1][9] = '32';
letters[0][1][10] = '42';
letters[0][1][11] = '92';
letters[0][2] = new Array(7);
letters[0][2][0] = 'j';
letters[0][2][1] = '11';
letters[0][2][2] = '12';
letters[0][2][3] = '31';
letters[0][2][4] = '51';
letters[0][2][5] = '61';
letters[0][2][6] = '71';
letters[0][2][7] = '91';
letters[0][3] = new Array(16);
letters[0][3][0] = 'f';
letters[0][3][1] = '7';
letters[0][3][2] = '07';
letters[0][3][3] = '17';
letters[0][3][4] = '27';
letters[0][3][5] = '37';
letters[0][3][6] = '57';
letters[0][3][7] = '67';
letters[0][3][8] = '70';
letters[0][3][9] = '71';
letters[0][3][10] = '72';
letters[0][3][11] = '73';
letters[0][3][12] = '74';
letters[0][3][13] = '75';
letters[0][3][14] = '77';
letters[0][3][15] = '78';
letters[0][3][16] = '79';

letters[1] = new Array(4);
letters[1][0] = new Array(9);
letters[1][0][0] = 'c';
letters[1][0][1] = '8';
letters[1][0][2] = '08';
letters[1][0][3] = '18';
letters[1][0][4] = '38';
letters[1][0][5] = '84';
letters[1][0][6] = '85';
letters[1][0][7] = '86';
letters[1][0][8] = '88';
letters[1][0][9] = '89';
letters[1][1] = new Array(10);
letters[1][1][0] = 'h';
letters[1][1][1] = '15';
letters[1][1][2] = '25';
letters[1][1][3] = '35';
letters[1][1][4] = '45';
letters[1][1][5] = '52';
letters[1][1][6] = '55';
letters[1][1][7] = '57';
letters[1][1][8] = '58';
letters[1][1][9] = '65';
letters[1][1][10] = '95';
letters[1][2] = new Array(15);
letters[1][2][0] = 'i';
letters[1][2][1] = 'y';
letters[1][2][2] = '1';
letters[1][2][3] = '01';
letters[1][2][4] = '10';
letters[1][2][5] = '11';
letters[1][2][6] = '13';
letters[1][2][7] = '14';
letters[1][2][8] = '15';
letters[1][2][9] = '16';
letters[1][2][10] = '17';
letters[1][2][11] = '18';
letters[1][2][12] = '19';
letters[1][2][13] = '21';
letters[1][2][14] = '41';
letters[1][2][15] = '81';
letters[1][3] = new Array(7);
letters[1][3][0] = 'pinto*';
letters[1][3][1] = '14';
letters[1][3][2] = '44';
letters[1][3][3] = '54';
letters[1][3][4] = '64';
letters[1][3][5] = '74';
letters[1][3][6] = '84';
letters[1][3][7] = '94';

letters[2] = new Array(4);
letters[2][0] = new Array(11);
letters[2][0][0] = 'penta*';
letters[2][0][1] = '5';
letters[2][0][2] = '05';
letters[2][0][3] = '50';
letters[2][0][4] = '51';
letters[2][0][5] = '53';
letters[2][0][6] = '54';
letters[2][0][7] = '55';
letters[2][0][8] = '56';
letters[2][0][9] = '59';
letters[2][0][10] = '75';
letters[2][0][11] = '85';
letters[2][1] = new Array(21);
letters[2][1][0] = 'd';
letters[2][1][1] = 'm';
letters[2][1][2] = '3';
letters[2][1][3] = '03';
letters[2][1][4] = '13';
letters[2][1][5] = '23';
letters[2][1][6] = '30';
letters[2][1][7] = '31';
letters[2][1][8] = '32';
letters[2][1][9] = '33';
letters[2][1][10] = '34';
letters[2][1][11] = '35';
letters[2][1][12] = '36';
letters[2][1][13] = '37';
letters[2][1][14] = '38';
letters[2][1][15] = '39';
letters[2][1][16] = '43';
letters[2][1][17] = '53';
letters[2][1][18] = '63';
letters[2][1][19] = '73';
letters[2][1][20] = '83';
letters[2][1][21] = '93';
letters[2][2] = new Array(18);
letters[2][2][0] = 'k';
letters[2][2][1] = 's';
letters[2][2][2] = 'v';
letters[2][2][3] = 'l';
letters[2][2][4] = 'r';
letters[2][2][5] = '4';
letters[2][2][6] = '04';
letters[2][2][7] = '24';
letters[2][2][8] = '34';
letters[2][2][9] = '40';
letters[2][2][10] = '41';
letters[2][2][11] = '42';
letters[2][2][12] = '43';
letters[2][2][13] = '44';
letters[2][2][14] = '45';
letters[2][2][15] = '46';
letters[2][2][16] = '47';
letters[2][2][17] = '48';
letters[2][2][18] = '49';
letters[2][3] = new Array(21);
letters[2][3][0] = 'b';
letters[2][3][1] = 'n';
letters[2][3][2] = '6';
letters[2][3][3] = '06';
letters[2][3][4] = '16';
letters[2][3][5] = '26';
letters[2][3][6] = '36';
letters[2][3][7] = '46';
letters[2][3][8] = '56';
letters[2][3][9] = '60';
letters[2][3][10] = '61';
letters[2][3][11] = '62';
letters[2][3][12] = '63';
letters[2][3][13] = '64';
letters[2][3][14] = '65';
letters[2][3][15] = '66';
letters[2][3][16] = '67';
letters[2][3][17] = '68';
letters[2][3][18] = '69';
letters[2][3][19] = '76';
letters[2][3][20] = '86';
letters[2][3][21] = '96';

letters[3] = new Array(4);
letters[3][0] = new Array(25);
letters[3][0][0] = 'e';
letters[3][0][1] = 'w';
letters[3][0][2] = 'x';
letters[3][0][3] = 'ä';
letters[3][0][4] = 'ü';
letters[3][0][5] = 'ö';
letters[3][0][6] = '0';
letters[3][0][7] = '00';
letters[3][0][8] = '01';
letters[3][0][9] = '02';
letters[3][0][10] = '03';
letters[3][0][11] = '04';
letters[3][0][12] = '05';
letters[3][0][13] = '06';
letters[3][0][14] = '07';
letters[3][0][15] = '08';
letters[3][0][16] = '09';
letters[3][0][17] = '10';
letters[3][0][18] = '20';
letters[3][0][19] = '30';
letters[3][0][20] = '40';
letters[3][0][21] = '50';
letters[3][0][22] = '60';
letters[3][0][23] = '70';
letters[3][0][24] = '80';
letters[3][0][25] = '90';
letters[3][1] = new Array(13);
letters[3][1][0] = 'a';
letters[3][1][1] = 'ä';
letters[3][1][2] = '@';
letters[3][1][3] = '2';
letters[3][1][4] = '02';
letters[3][1][5] = '20';
letters[3][1][6] = '22';
letters[3][1][7] = '23';
letters[3][1][8] = '24';
letters[3][1][9] = '29';
letters[3][1][10] = '52';
letters[3][1][11] = '62';
letters[3][1][12] = '72';
letters[3][1][13] = '82';
letters[3][2] = new Array(23);
letters[3][2][0] = 'o';
letters[3][2][1] = 'g';
letters[3][2][2] = 'q';
letters[3][2][3] = 'ö';
letters[3][2][4] = '9';
letters[3][2][5] = '09';
letters[3][2][6] = '19';
letters[3][2][7] = '29';
letters[3][2][8] = '39';
letters[3][2][9] = '49';
letters[3][2][10] = '59';
letters[3][2][11] = '69';
letters[3][2][12] = '79';
letters[3][2][13] = '89';
letters[3][2][14] = '90';
letters[3][2][15] = '91';
letters[3][2][16] = '92';
letters[3][2][17] = '93';
letters[3][2][18] = '94';
letters[3][2][19] = '95';
letters[3][2][20] = '96';
letters[3][2][21] = '97';
letters[3][2][22] = '98';
letters[3][2][23] = '99';
letters[3][3] = new Array(6);
letters[3][3][0] = 'u';
letters[3][3][1] = 'ü';
letters[3][3][2] = '47';
letters[3][3][3] = '76';
letters[3][3][4] = '77';
letters[3][3][5] = '87';
letters[3][3][6] = '97';

function drawWord(id, input_word) {
  var circle_dimension = 95;
  var margin = 8;
  var space = 7;
  var word = input_word.toLowerCase();
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

        block.toBack();

        // Drop shadow
        shadow = paper.rect(margin + space_x, margin + space_y, circle_dimension, circle_dimension, 10);
        shadow.attr({stroke: "none", fill: "gray", translation: "2,2"});
        shadow.blur(2);
        shadow.toBack();

/*        // Path
        if(path_x != undefined && path_y != undefined){
          var path = paper.path("M"+path_x+" "+path_y+"L"+point_x+" "+point_y);
          path.attr({stroke: point_color, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.75});
          path.toFront();
        }
        // Save coords for path
        path_x = point_x;
        path_y = point_y;
*/
      }
    }
  }
  // Paint P
  if(hasALetterP(word)){
    var letter_p = paper.circle(canvas_width/2.03, canvas_height/2.03, 5);
    letter_p.attr({fill: 'none', stroke: 'grey', 'stroke-width': 7})
  }

  paper_content.toBack();
  paper_shadow.toBack();

  return $('#' + id + ' svg');
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
 '#777F7E', // 1
 '#1f51a8', // 2
 '#e6437f', // 3
 '#5F2A17', // 4
 '#49c8fa', // 5
 '#DFBE29', // 6
 '#3FFF6B', // 7
 '#b392d8', // 8
 '#FFF82A' // 9
)

function coord2color(x, y) {
  return colors[coord2digit(x, y)];
}
