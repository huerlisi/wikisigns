function initializeTooltips() {
  if(!isAiOS()){
    $('*[data-tooltip]').each(function(){
      var tooltip_position = 'leftTop';
      var target_position = 'rightBottom';

      if($(this).data('tooltip-position')) {
        tooltip_position = $(this).data('tooltip-position');

        switch(tooltip_position) {
          case 'leftTop':
            target_position = 'rightBottom';
            break;
          case 'topRight':
            target_position = 'bottomLeft';
            break;
          default:
            target_position = 'rightBottom';
            break;
        }
      }

      $(this).qtip({
        content: $(this).attr('data-tooltip'),
        style: {
          border: {
            radius: 5
          },
          tip: true,
          name: 'light'
        },
        position: {
          corner: {
            tooltip: tooltip_position,
            target: target_position
          }
        }
      });
    });
  }
}