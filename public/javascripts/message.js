// Message Mode
// ============

// Setup/Teardown
// ==============

// Setup handlers
function setupMessageModeHandlers() {
  // Draw a new word and submit it to the database on submit
  $('#new_message').live('submit', submitWord);

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
