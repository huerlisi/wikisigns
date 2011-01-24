function drawWord() {
  var canvas_width = 424;
  var canvas_height = 424;
  var circle_dimension = 95;
  var margin = 12;
  var space = 7;
  var paper = Raphael(document.getElementById('word'), canvas_width, canvas_height);

  for(var x = 0; x < 4; x++){
    for(var y = 0; y < 4; y++){
      var space_x = x * circle_dimension + space * x;
      var space_y = y * circle_dimension + space * y;
      var circle = paper.rect(margin + space_x, margin + space_y, circle_dimension, circle_dimension, 10);
      circle.attr({fill: '#00FF00'});
      paper.text(margin + circle_dimension/2 - 2 + space_x, margin + circle_dimension/2 + space_y, 'O');
    }
  }
}