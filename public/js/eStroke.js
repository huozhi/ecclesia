;(function($) {
  $.fn.Stroke = function(cb, color) {
    $(this).on('mousedown mouseleave mouseup mouseout mousemove', function (event) {
      
      var keyDown, point, ctx;
      keyDown = $(this).data('keyDown');
      if (keyDown == undefined) {
        $(this).data('keyDown', false);
        keyDown = false;
      }
      
      point = {
        x:    event.pageX - $(this).offset().left,
        y:    event.pageY - $(this).offset().top,
        type: event.type,
        key: keyDown
      };
      ctx = $(this).get(0).getContext('2d');

      ctx.lineJoin = 'round';
      ctx.lineCap  = 'round';
      ctx.lineWidth = 5;
      ctx.strokeStyle = color || 'black';
      switch (event.type) {
        case 'mousedown':
          if (keyDown == false) {
            $(this).data('keyDown', true);
            point.key = true;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);

          }
          break;
        case 'mousemove':
          if (keyDown == true) {
            point.key = true;
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
          break;
        case 'mouseup':
        case 'mouseleave':
        case 'mouseout':
          $(this).data('keyDown', false);
          ctx.stroke();
          // ctx.closePath();
      }
      // if (typeof cb == 'function')
      return cb(point);
    });
  }
  $.fn.syncStroke = function(point, color) {
    console.log('got sync signal');
    var ctx = $(this).get(0).getContext('2d');
    ctx.lineJoin  = 'round';
    ctx.lineCap   = 'round';
    ctx.lineWidth = 5;
    ctx.strokeStyle = color || 'black';
    switch (point.type) {
      case 'mousedown':
          if (point.key == true) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
          }
          break;
        case 'mousemove':
          if (point.key == true) {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
          break;
        case 'mouseup':
        case 'mouseleave':
        case 'mouseout':
          ctx.stroke();
          // ctx.closePath();
          break;
    }
    return $(this);
  }
})(jQuery);