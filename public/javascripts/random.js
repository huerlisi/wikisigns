// Random Mode
// ===========

// Global Settings
var random_bar_signs = 8;	// Number of signs in side bar

function populateBar() {
  var bar = $('#side-bar');

  for (i = 1; i <= random_bar_signs ; i++)
  {
    var sign = buildSideBarSign('test', i);
    var sign_holder = $('<div class="sign" id="sign-' + i + '">');

    bar.append(sign_holder.append(sign));
  }
}

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
      var index = Math.floor(Math.random() * random_bar_signs);
      replaceSideBarSign(index, text, id);
    }
  });
}

function setRandomMode(word, id) {
  var speed = 314*3.14*3.14;
  populateBar();
  setInterval('showNewRandomWord()', speed);

  showAsBigWord(word);
  startShowWord(word);
}
