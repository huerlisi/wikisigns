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

function showMessage(word) {
  startFullScreen($('#main-sign'));
  startShowWord(word['word'], function() { message_queue.dequeue() });
}

function queueMessage(word) {
  message_queue.queue(function() {
    showMessage(word);
  });

  message_queue.promise().done(stopMessages);

  // Show Webkit Desktop Notification
  showDesktopNotification(word);
}

function stopMessages() {
  message_queue.clearQueue();
  $('#word-notification').fadeOut(1000);
  stopFullScreen();
}

// Webkit Desktop Notification
function showDesktopNotification(word_item) {
  if(window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) {
    var word = word_item['word']
    var text = 'Wiksigns.ch sagt: ' + word;
    var popup = window.webkitNotifications.createNotification('/word/' + word + '.png', 'Wikisigns.ch', text);

    popup.show();
    setTimeout(function(){
      popup.cancel();
    }, 30000);
  }
}

function setDesktopNotificationPermission() {
  $('#desktop-notification-permission').live('click', function(){
    window.webkitNotifications.requestPermission();
  });
}

function createDesktopNotificationLink() {
  $('#inspiration-links').append('<br/><a id="desktop-notification-permission" data-tooltip-position="topRight" data-tooltip="Aktivieren Sie Desktop Benachrichtigungen. So erhalten Sie eine Benachrichtigung wenn ein neues Sign erstellt wird." href="#">Benachrichtigung</a>');
  initializeTooltips();
}

function enableDesktopNotification() {
  if(window.webkitNotifications){
    setDesktopNotificationPermission();
    createDesktopNotificationLink();
  }
}

// Inspiration
function nextInspirationWord() {
  var amount = $('#inspiration-content .word').length;
  var random_index = Math.floor(Math.random() * amount) + 1;
  var element = $('#inspiration-content .word:nth-child(' + random_index + ')');

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

      replaceSmallSign(random_index, text, 70);
      queueMessages(messages);
    }
  });
}

function drawInspirationWord(word_div) {
  var text = word_div.find('.one-word').data('word-word');
  var sign = word_div.find('.word');

  drawWordAsImage(sign, text, 70);
}

// Mode setup and teardown
function stopInspirationMode() {
  clearInterval(inspiration_interval);
  $('#full-screen-container').removeClass('enabled');
}
//stopCurrentMode = stopInspirationMode;

function setInspirationMode() {
  $('#full-screen-container').addClass('enabled');

  // Populate view with small signs
  $('#inspiration-content .sign').each(function(){
    drawInspirationWord($(this));
  });

  // Close popup and clear queue if anything is clicked
  $('#container, #word-notification').click(function(){
    stopMessages();
  });

  $('#inspiration-content .one-word').live('click', function(){
    var word = $(this).data('word-word');

    startFullScreen($('#main-sign'));
    startShowWord(word, stopFullScreen);
  });

  // Replace a random sign every second
  inspiration_interval = setInterval(nextInspirationWord, 1000);

  // Webkit desktop notification
  enableDesktopNotification();
  
  $('#wikisigns-logo').css('z-index', '3000');
}
