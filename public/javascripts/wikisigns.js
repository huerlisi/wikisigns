function displaySessionSmallWord(word_picture, text, id){
  var share_link = generateShareLink(id);

  word_picture = addSmallWordAttributes(word_picture);
  $('#your-words').append('<div class="svg"><div class="svg-text">'+ text +'</div>'+ share_link +'</div>');
  $('#your-words .svg:last-child').prepend(word_picture);
  FB.XFBML.parse();
}

function generateShareLink(id) {
  var link = "";

  if($('.facebook-user').length>0){
    link = '<fb:like layout="button_count" href="http://' + window.location.hostname + '/words/' + id + '"></fb:like>';
  }

  if($('.twitter-user').length>0){
    link = '<div class="social-media-links"><a class="twitter-share-button" href="http://twitter.com/share?url=http://' + window.location.hostname + '/words/' + id + '">Tweet</a></div>';
  }

  return link;
}