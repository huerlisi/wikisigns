// Random Bar
// ==========
function showNewRandomWord() {
  $.ajax({
    type: 'GET',
    url: '/words/random.json',
    dataType: 'json',
    cache: false,
    success: function(data){
      var text = data['word']['word'];
      var id = data['word']['id'];

      // Add small sign to random list
      addSignToBar(text, id);
    }
  });
}

function setRandomMode() {
  var speed = 314*3.14*3.14;
  setInterval('showNewRandomWord()', speed);
}
