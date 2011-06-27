var session_viewer;
var session_viewer_start;
var picture_to_show = 1;
var session_viewer_timeout;

// Start the session viewers show.
function startSessionViewer() {
  clearSessionViewerIntervals();
  session_viewer_start = setInterval('playSessionViewer()', 60000)
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
  var length = $('#side-bar .one-word').length;

  clearSessionViewerIntervals();

  if(length < picture_to_show){
    picture_to_show = 1;
  }

  // Read word params from element
  var sign = $('#side-bar .one-word:eq(' + picture_to_show + ')');
  showAsBigWord(sign.data('word-word'));

  setTimeout('startShowWord()', letter_speed);
  showPauseAndHidePlayButton();

  picture_to_show++;
}

// Clears all intervals that are used for the session viewer.
function clearSessionViewerIntervals() {
  clearInterval(session_viewer_start);
  clearInterval(session_viewer);
  clearTimeout(session_viewer_timeout);
  clearTimeout(draw_word_interval);
  session_viewer = null;
  session_viewer_start = null;
  session_viewer_timeout = null;
  draw_word_interval = null;
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

// Opens a fancy box with a share menu of the current session show.
// Trigger is in app/views/shared/game_menu
function shareSessionLinkBehaviour() {
  var link = $('a#session-share-link').attr('href');

  $('a#session-share-link').click(function(e){
    e.preventDefault();

    var ids = new Array();

    $('#your-words .one-word').each(function(){
      // TODO:Broken because we don't set data-word-id anymore...
      ids.push($(this).attr('data-word-id'));
    });

    link += '?';

    for(var i = 0; i < ids.length; i++){
      link += 'words[]=' + ids[i] + '&';
    }

    $(this).attr('href', link);

    $(this).fancybox({
      'hideOnContentClick': true
    });
  });
}
