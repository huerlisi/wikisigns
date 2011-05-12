function showAsBigWord(element, click_on_element) {
  if(click_on_element == null) click_on_element = false;
  text_input.val('');
  $('#title-inserted span').remove();
  $('#title').show();
  $('#title').html(drawColoredWord(element.attr('data-word-word')));
  $('#word svg').remove();
  drawWordAsImage('word', element.attr('data-word-word'));

  if(click_on_element) {
    clearSessionViewerIntervals();
    showPlayAndHidePauseButton();
    startSessionViewer();
  }
}