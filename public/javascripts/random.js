// Random Mode
// ===========

// Global Settings
var random_bar_signs = 8;	// Number of signs in side bar

function populateBar() {
  var bar = $('#side-bar');

  for (i = 1; i <= random_bar_signs ; i++)
  {
    var sign_holder = $('<div class="sign" id="sign-' + i + '">');
    bar.append(sign_holder);
  }
}

function showRandomSideBarSign() {
  $.ajax({
    type: 'GET',
    url: '/words/random.json',
    dataType: 'json',
    cache: false,
    success: function(data){
      var text = data['word']['word'];

      // Add small sign to random list
      var index = Math.floor(Math.random() * random_bar_signs);
      replaceSideBarSign(index, text);
    }
  });
}

// Mode setup and teardown
var sidebar_timer;

function stopRandomMode() {
  clearInterval(sidebar_timer);
}

function setRandomMode(word) {
  populateBar();

  // Show a new random sign in the sidebar every 6s
  sidebar_timer = setInterval(showRandomSideBarSign, 6000);

  // Show first sidebar sign right now
  showRandomSideBarSign();

  showAsBigWord(word);
  startShowWord(word);
}
