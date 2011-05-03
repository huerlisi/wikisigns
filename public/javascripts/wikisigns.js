function displaySessionSmallWord(word_picture, text, id){
  var share_link = generateShareLink(text);

  word_picture = addSmallWordAttributesForSessionView(word_picture);
  $('#your-words').append('<div class="svg selectable"><div class="word-text svg-text">'+ drawColoredWord(text) +'</div>'+ share_link +'</div>');
  $('#your-words .svg:last-child').prepend(word_picture);
  $('#your-words .svg:last-child').click(function(){
    showSmallPictureAsBigWord(this);
  });
  $('#your-words .svg:last-child').append(createLinkToPNGDownload(id));
  FB.XFBML.parse();
  $('#your-words').scrollTop = 0-$('#your-words').scrollHeight;
}

function generateShareLink(id) {
  var link = "";

  if($('.facebook-user').length>0){
    link = '<fb:like layout="button_count" href="http://' + window.location.hostname + '/word/' + id + '"></fb:like>';
  }

  if($('.twitter-user').length>0){
    var url = 'http://' + window.location.hostname + '/word/' + id;

    link = '<div class="social-media-links"><a class="twitter-share-button" href="http://twitter.com/share" data-url="' + url + '">Tweet</a></div>';
    link += '<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script>';
  }

  return link;
}