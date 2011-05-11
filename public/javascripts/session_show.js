var session_viewer;
var session_viewer_start;
var picture_to_show = 1;

// Start the session viewers show.
function startSessionViewer() {
  clearSessionViewerIntervals();
  session_viewer_start = setInterval('initializeShowSessionViewer()', 30000)
}

// Continue with the session viewer show.
function initializeShowSessionViewer() {
  clearSessionViewerIntervals();
  session_viewer = setInterval('showSessionViewer()', 1000);
}

// Show a picture as session viewer
function showSessionViewer() {
  if($('#your-words .one-word').length < picture_to_show){
    picture_to_show = 1;
  }
  $('#your-words .one-word:nth-child(' + picture_to_show + ')').trigger('click');
  picture_to_show++;
}

// Clears all intervals that are used for the session viewer.
function clearSessionViewerIntervals() {
  clearInterval(session_viewer_start);
  clearInterval(session_viewer);
}
