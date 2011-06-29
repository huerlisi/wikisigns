// Welcome Mode
// ============

// Loads the guessing game on the root page.
// It starts with the alphabet.
function setWelcomeMode() {
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';

  startShowWord(alphabet,
                function(){
                  $('#left-container').hide(125, function(){
                    window.location = '/words/new';
                  });
                },
                function(text, callback){
                  var colored_text = $(drawColoredWord(text));
                  var last_letter = colored_text.filter('span:last');

                  last_letter.css('position', 'relative');
                  last_letter.css('left', '3000px');
                  last_letter.css('top', '2000px');
                  last_letter.css('z-index', '1');
                  $('#title').html(colored_text);

                  last_letter.animate({
                                        top: '0px',
                                        left: '0px'
                                      },
                                      250,
                                      function(){
                                        if(typeof(callback) != "undefined"){
                                          callback();
                                        }
                                      });
                });
}

$(document).ready(initializeBehaviours);
