// Random Mode
// ===========

// Global Settings
var random_bar_signs = 8;	// Number of signs in side bar

function populateBar() {
  var bar = $('#side-bar');

  for (i = 1; i <= random_bar_signs ; i++)
  {
    var sign_holder = $('<div class="sign random-bar" id="sign-' + i + '">');
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

function showRandomSign() {
  $.ajax({
    type: 'GET',
    url: '/words/random.json',
    dataType: 'json',
    cache: false,
    success: function(data){
      var text = data['word']['word'];

      startShowWord(text, startRandomSignTimer);
    }
  });
}

// Wait 3s before next word
var startRandomSignTimer = function() {
  next_random_sign_timer = setTimeout(showRandomSign, 3000);
};

afterShowSmallSign = startRandomSignTimer;

// Mode setup and teardown
var sidebar_timer;
var next_random_sign_timer;

function stopRandomMode() {
  clearInterval(sidebar_timer);
  clearTimeout(next_random_sign_timer);
}

function setRandomMode(word) {
  populateBar();

  // Show a new random sign in the sidebar every 6s
  sidebar_timer = setInterval(showRandomSideBarSign, 6000);

  // Show first sidebar sign right now
  showRandomSideBarSign();

  // Show a new random sign in the main container
  showRandomSign();
}

stopCurrentMode = function() {
  clearSessionViewerIntervals();
};