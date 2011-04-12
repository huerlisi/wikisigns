function displaySessionSmallWord(word_picture, text, id){
  var share_link = '<fb:like href="http://' + window.location.hostname + '/word/' + text + '" layout="button_count" show_faces="true" width="100"></fb:like>';

  word_picture = addSmallWordAttributes(word_picture);
  $('#your-words').append('<div class="svg selectable"><div class="word-text svg-text">'+ drawColoredWord(text) +'</div>'+ share_link +'</div>');
  $('#your-words .svg:last-child').prepend(word_picture);
  $('#your-words .svg:last-child').click(function(){
    showSmallPictureAsBigWord(this);
  });
  FB.XFBML.parse();
}