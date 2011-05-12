var session_viewer;
var session_viewer_start;
var picture_to_show = 1;
var session_viewer_timeout;

// Start the session viewers show.
function startSessionViewer() {
  clearSessionViewerIntervals();
  session_viewer_start = setInterval('initializeShowSessionViewer()', 60000)
}

// Continue with the session viewer show.
function initializeShowSessionViewer() {
  clearSessionViewerIntervals();
  session_viewer = setInterval('showSessionViewer()', 1000);
  showPauseAndHidePlayButton();
}

// Starts the session viewer.
// Trigger is in app/views/shared/game_menu
function playSessionViewer() {
  clearSessionViewerIntervals();
  session_viewer = setInterval('showSessionViewer()', 1000);
  showPauseAndHidePlayButton();
}

// Pauses the session viewer.
// Trigger is in app/views/shared/game_menu
function pauseSessionViewer() {
  clearSessionViewerIntervals();
  showPlayAndHidePauseButton();
}

// Show a picture as session viewer
function showSessionViewer() {
  var timeout = 2000; // 2 seconds for the timeout to the next word.
  var length = $('#your-words .one-word').length;

  clearSessionViewerIntervals();

  if(length < picture_to_show){
    picture_to_show = 1;
  }

  if(length == picture_to_show) {
    timeout = timeout * 5 * 3; // 30 seconds timeout after the last word.
  }

  showAsBigWord($('#your-words .one-word:nth-child(' + picture_to_show + ')'));
  picture_to_show++;
  session_viewer_timeout = setTimeout('showSessionViewer()', timeout);
}

// Clears all intervals that are used for the session viewer.
function clearSessionViewerIntervals() {
  clearInterval(session_viewer_start);
  clearInterval(session_viewer);
  clearTimeout(session_viewer_timeout);
}

// Shows the play button and hides the pause button.
function showPlayAndHidePauseButton() {
 $('#pause-session-show').hide(0, function(){
  $('#start-session-show').show();
 });
}

// Shows the pause button and hides the play button.
function showPauseAndHidePlayButton() {
  $('#start-session-show').hide(0, function(){
    $('#pause-session-show').show();
  })
}

function shareSessionLink() {

}
