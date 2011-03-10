function displaySessionSmallWord(word_picture, text, id){
  var share_link = '<fb:like href="http://' + window.location.hostname + '/words/' + id + '" layout="button_count" show_faces="true" width="100"></fb:like>';

  word_picture = addSmallWordAttributes(word_picture);
  $('#your-words').append('<div class="svg"><div class="svg-text">'+ text +'</div>'+ share_link +'</div>');
  $('#your-words .svg:last-child').prepend(word_picture);
  FB.XFBML.parse();
}