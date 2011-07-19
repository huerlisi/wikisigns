// Message Mode
// ============

// Handlers
// ========
// Submits and draws a new word.
function handleMessageSubmit() {
  // Form input field
  var input = $('#message_text');

  var word = input.val();
  var text = word.trim();

  // Clear message input
  // This should be done not in the AJAX callback to not
  // loose key types too often.
  input.val('');
  input.focus().select();

  // Empty main
  updateTitle('');
  updateWord('');

  // Submit to server
  $.ajax({
    type: 'POST',
    data: { message : {
      text : text,
      to_user_id : $('#message_to_user_id').val()
    } },
    url: '/messages.json',
    success: function(){
      // Main sign
      showAsBigWord('');

      // Add small sign to history
      addSideBarSign(text);
    }
  })
}

// Setup/Teardown
// ==============

// Setup handlers
function setupMessageModeHandlers() {
  // Draw a new word and submit it to the database on submit
  $('#new_message').live('submit', handleMessageSubmit);

  // Redraws sign after every key stroke
  $('#message_text').live('keyup', handleKeyUp);
}

// Teardown handlers
function teardownMessageModeHandlers() {
}

function startMessageMode() {
  // Handlers
  setupMessageModeHandlers();
  stopCurrentMode = stopMessageMode;
}

function stopMessageMode() {
  // Handlers
  teardownGameModeHandlers();

  // Fade out guess title
  $('#main-control *').animate({opacity: 0}, 1000).remove();
}
