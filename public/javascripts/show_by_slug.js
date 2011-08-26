// Sets the mode to show by slug
// Triggered on: :action => 'show_by_slug'
//               :controller => 'word'
function setShowBySlugMode() {
  var text_container = $('#title');
  var text = text_container.text();

  text_container.show(startShowWord(text));
}