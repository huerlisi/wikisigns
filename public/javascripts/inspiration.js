var inspiration_interval;
var theQueue = $({});

$(document).ready(function(){
  $('#inspiration-content .word').each(function(){
    drawInspirationWord($(this));
  });

  startInspiration();
  startNewWordNotification();
});

function startNewWordNotification() {
  var client = new Faye.Client('http://localhost:3000/faye', { timeout: 120 });
  var subscription = client.subscribe('/word/new', function(message) {
    if(message['word'] != null){
      theQueue.queue(function(next) {
        var content = $('#word-notification .word, #word-notification .sign');

        content.hide();
        startFullScreen();
        drawWordAsImage($('#word-notification .sign'), message['word']);
        $('#word-notification .word').html(drawColoredWord(message['word']));
        content.show();

        $('#word-notification').fadeIn(3000, function(){
          setTimeout(function(){
            content.hide();
            $('#word-notification').fadeOut(1000);
            stopSignPopUp(next);
          }, 1000);
        });

        $('#container').click(function(){
          stopSignPopUp(next);
        });

        $('#container').click(function(){
          $('#word-notification').hide();
        });
      });
    }
  });
}

function stopSignPopUp(next) {
  stopFullScreen();
  next();
}

function startInspiration() {
  inspiration_interval = setInterval('nextInspirationWord()', 1000);
}

function nextInspirationWord() {
  clearInterval(inspiration_interval);

  var amount = $('#inspiration-content .word').length;
  var random_number = Math.floor(Math.random() * amount) + 1;
  var element = $('#inspiration-content .word:nth-child(' + random_number + ')');

  $.ajax({
    type: 'GET',
    url: '/words/random.json',
    dataType: 'json',
    cache: false,
    success: function(data){
      var text = data['word']['word'];

      drawInspirationWord(element, text);
      startInspiration();
    },
    fail: function(){
      startInspiration();
    }
  });
}

function drawInspirationWord(word_div, text) {
  if (text == null) text = word_div.children('label').text();
  var sign = word_div.children('.sign');

  drawWordAsImage(sign, text, 70);
}