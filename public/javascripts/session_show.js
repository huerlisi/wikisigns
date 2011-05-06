var session_viewer;
var session_viewer_start;
var picture_to_show = 1;

// Start des Session viewers
function startSessionViewer() {
  clearSessionViewerIntervals();
  session_viewer_start = setInterval('initializeShowSessionViewer()', 30000)
}

function initializeShowSessionViewer() {
  session_viewer = setInterval('showSessionViewer()', 1000);
}

// Bild anzeigen als Session viewer.
function showSessionViewer() {
  if($('#your-words .one-word').length < picture_to_show){
    picture_to_show = 1;
  }
  $('#your-words .one-word:nth-child(' + picture_to_show + ')').trigger('click');
  picture_to_show++;
}

function clearSessionViewerIntervals() {
  clearInterval(session_viewer_start);
  clearInterval(session_viewer);
}
