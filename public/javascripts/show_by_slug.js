// Sets the mode to show by slug
// Triggered on: :action => 'show_by_slug'
//               :controller => 'word'
function setShowBySlugMode() {
  var text = $('#title').text();

  updateWord(text);
  $('#title').html(drawColoredWord(text));
}