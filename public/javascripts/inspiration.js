// Inspiration Mode
// ================

// Global Settings
var inspiration_interval;
var message_queue = $({});
var latest_notification;

$(document).ready(function(){
  setInspirationMode();
});

// Message popup
function queueMessages(messages) {
  $(messages).each(function() {
    queueMessage(this['word']);
  });
}

function queueMessage(word) {
  message_queue.queue(function(next) {
    startFullScreen();
    drawWordAsImage($('#word-notification .sign'), word['word']);
    $('#word-notification .word').html(drawColoredWord(word['word']));

    $('#word-notification').fadeIn(3000, function(){
      setTimeout(function(){
        stopSignPopUp(next);
      }, 3000);
    });

    // Close popup and clear queue if anything is clicked
    $('#container, #word-notification').click(function(){
      stopSignPopUp(next);
      theQueue.clearQueue();
    });
  });
}

function stopSignPopUp(next) {
  $('#word-notification').hide();
  stopFullScreen();
  next();
}

// Inspiration
function nextInspirationWord() {
  var amount = $('#inspiration-content .word').length;
  var random_number = Math.floor(Math.random() * amount) + 1;
  var element = $('#inspiration-content .word:nth-child(' + random_number + ')');

  $.ajax({
    type: 'GET',
    url: '/words/random_messages.json',
    data: {timestamp: latest_notification},
    dataType: 'json',
    cache: false,
    success: function(data){
      var text = data['word']['word']['word'];
      var messages = data['messages'];
      latest_notification = data['timestamp'];

      drawInspirationWord(element, text);
      queueMessages(messages);
    }
  });
}

function drawInspirationWord(word_div, text) {
  if (text == null) text = word_div.children('label').text();
  var sign = word_div.children('.sign');

  drawWordAsImage(sign, text, 70);
}

// Mode setup and teardown
function stopInspirationMode() {
  clearInterval(inspiration_interval);
}
stopCurrentMode = stopInspirationMode;

function setInspirationMode() {
  // Populate view with small signs
  $('#inspiration-content .word').each(function(){
    drawInspirationWord($(this));
  });

  // Replace a random sign every second
  inspiration_interval = setInterval(nextInspirationWord, 1000);
}
