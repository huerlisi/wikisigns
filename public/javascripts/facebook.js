function displaySessionSmallWord(word_picture, text, id){
  var share_link = '<fb:share-button href="' + window.location.hostname + '/words/' + id + '"></fb:share-button>';

  word_picture = addSmallWordAttributes(word_picture);
  $('#your-words').append('<div class="svg"><div class="svg-text">'+ text +'</div>'+ share_link +'</div>');
  $('#your-words .svg:last-child').prepend(word_picture);
  FB.XFBML.parse();
}