function initializeTooltips() {
  $('*[data-tooltip]').each(function(){
    $(this).qtip({
      content: $(this).attr('data-tooltip'),
      style: {
        border: {
          radius: 5
        },
        tip: true,
        name: 'light'
      }
    });
  });
}