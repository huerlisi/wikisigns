var client = new Faye.Client('http://localhost:3000/faye', { timeout: 120 });
var subscription = client.subscribe('/word/new', function(message) {
  if(message['word'] != null){
    console.log(message['word']);
  }
});
