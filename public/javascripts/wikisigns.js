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

