var __slice = Array.prototype.slice;
(function($) {
  var Sketch;
  //扩展jquery函数
  $.fn.sketch = function() {  
    var args, key, sketch;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (this.length > 1) {
      $.error('Sketch.js can only be called on one element at a time.');
    }
    //返回sketch对象
    sketch = this.data('sketch');
    if (typeof key === 'string' && sketch) {
      if (sketch[key]) {
        if (typeof sketch[key] === 'function') {
          return sketch[key].apply(sketch, args);
        } else if (args.length === 0) {
          return sketch[key];
        } else if (args.length === 1) {
          return sketch[key] = args[0];
        }
      } else {
        return $.error('Sketch.js did not recognize the given command.');
      }
    } else if (sketch) {
      //如果已经存在该插件实例，则返回实例
      return sketch;
    } else {
      // 将插件的实例存储在element.data里面 ,new 初始化插件的key值
      this.data('sketch', new Sketch(this.get(0), key));
      return this;
    }
  };

  Sketch = (function() {

    function Sketch(el, opts) {
      this.el = el;
      this.canvas = $(el);
      this.context = el.getContext('2d');
      //合并opts与{default}并修改{defaul}
      this.options = $.extend({
        toolLinks: true,
        defaultTool: 'marker',
        defaultColor: 'rgba(1,1,1,1)',
        defaultSize: 5
      }, opts);

      this.painting = false;
      this.color = this.options.defaultColor;
      this.size = this.options.defaultSize;
      this.tool = this.options.defaultTool;
      this.actions = [];
      this.action = [];
      //为canvas绑定事件（event, function）click mousedown mouseup mousemove mouseleave mouseout touchstart touchmove touchend touchcancel
      this.canvas.bind('click mousedown mouseup mousemove mouseleave mouseout touchmove touchend touchcancel', this.onEvent);

      if (this.options.toolLinks) {
        //给a[条件]添加点击处理事件
        $('body').delegate("a[href=\"#" + (this.canvas.attr('id')) + "\"]", 'click', function(e) {
          var $canvas, $this, key, sketch, _i, _len, _ref;
          $this = $(this);
          //获取canvas对象
          $canvas = $($this.attr('href'));
          //返回sketch对象
          sketch = $canvas.data('sketch');

          _ref = ['color', 'size', 'tool'];
          //匹配data-_ref属性
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            key = _ref[_i];
            if ($this.attr("data-" + key)) {
              sketch.set(key, $(this).attr("data-" + key));
            }
          }
          if ($(this).attr('data-download')) {
            sketch.download($(this).attr('data-download'));
          }
//====================l s n==================================
          if ($(this).attr('data-clear')){
            var c = $canvas [0];
            var ctx = c.getContext( "2d" );
            /*ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(800, 300);
            ctx.strokeStyle = "rgba(0,0,0,0)";
            var x = $canvas.width(),
                y = $canvas.height();
            var linesize = x * y * 2/Math.sqrt( x * x + y * y );
            ctx.lineWidth = linesize;
            ctx.stroke();*/
            ctx.clearRect(0,0,800,300);
            sketch.clearCanvas();
            sketch.set("tool","clearall");
          }
//==========================================================
          return false;
        });
      }

    }

    Sketch.prototype.download = function(format) {
      var mime;
      format || (format = "png");
      if (format === "jpg") {
        format = "jpeg";
      }
      mime = "image/" + format;
      return window.open(this.el.toDataURL(mime));
    };
    Sketch.prototype.set = function(key, value) {
      this[key] = value;
      return this.canvas.trigger(key, value);
    };
    Sketch.prototype.startPainting = function() {
      this.painting = true;
      return this.action = {
        tool: this.tool,
        color: this.color,
        size: parseFloat(this.size),
        events: []
      };
    };
    Sketch.prototype.stopPainting = function() {
      if (this.action) {
        this.actions.push(this.action);
        //this.actions = [];
      }
      this.painting = false;
      this.action = null;
      return this.redraw();
    };
//==========================l s n================================
    Sketch.prototype.clearCanvas = function() {
      if (this.action) {
        this.actions.push(this.action);
      }
        this.actions = [];
        this.painting = false;
        this.action = null;
        return this.redraw();
    };
//===============================================================
    Sketch.prototype.onEvent = function(e) {
      if (e.originalEvent && e.originalEvent.targetTouches) {
        e.pageX = e.originalEvent.targetTouches[0].pageX;
        e.pageY = e.originalEvent.targetTouches[0].pageY;
      }
      $.sketch.tools[$(this).data('sketch').tool].onEvent.call($(this).data('sketch'), e);
      e.preventDefault();
      return false;
    };
    Sketch.prototype.redraw = function() {
      var sketch;
      this.el.width = this.canvas.width();
      this.context = this.el.getContext('2d');
      sketch = this;
      $.each(this.actions, function() {
        if (this.tool) {
          return $.sketch.tools[this.tool].draw.call(sketch, this);
        }
      });
      if (this.painting && this.action) {
        return $.sketch.tools[this.action.tool].draw.call(sketch, this.action);
      }
    };

    return Sketch;
  })();

  $.sketch = {
    tools: {},
  };
  //========================l s n==============================
  $.sketch.tools.clearall = {
    onEvent: function(e) {
      switch (e.type) {
        case 'mousedown':
        case 'touchstart':
          this.startPainting();
          break;
        case 'mouseup':
        case 'mouseout':
        case 'touchend':
        case 'touchcancel':
        case 'mouseleave':
          this.stopPainting();
          this.clearCanvas();
      }
      if (this.painting) {
        this.action.events.push({
          x: e.pageX - this.canvas.offset().left,
          y: e.pageY - this.canvas.offset().top,
          event: e.type
        });
        return this.redraw();
      }
    },
    draw: function(action) {
      return ;
    }
  };
  $.sketch.tools.ban = {
    onEvent: function(e) {
      this.stopPainting();
      if (this.painting) {
        this.action.events.push({
          x: e.pageX - this.canvas.offset().left,
          y: e.pageY - this.canvas.offset().top,
          event: e.type
        });
        return this.redraw();
      }
    }
  };
//=============================================================
  $.sketch.tools.marker = {
    onEvent: function(e) {
      switch (e.type) {
        case 'mousedown':
        case 'touchstart':
          this.startPainting();
          break;
        case 'mouseup':
        case 'mouseout':
        case 'touchend':
        case 'touchcancel':
        case 'mouseleave':
          this.stopPainting();
      }
      if (this.painting) {
        this.action.events.push({
          x: e.pageX - this.canvas.offset().left,
          y: e.pageY - this.canvas.offset().top,
          event: e.type
        });
        return this.redraw();
      }
    },
    draw: function(action) {
      var event, previous, _i, _len, _ref;
      this.context.lineJoin = "round";
      this.context.lineCap = "round";
      this.context.beginPath();
      this.context.moveTo(action.events[0].x, action.events[0].y);
      _ref = action.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.context.lineTo(event.x, event.y);
        previous = event;
      }
      this.context.strokeStyle = action.color;
      this.context.lineWidth = action.size;
      return this.context.stroke();
    }
  };
  return $.sketch.tools.eraser = {
    onEvent: function(e) {
      return $.sketch.tools.marker.onEvent.call(this, e);
    },
    draw: function(action) {
      var oldcomposite;
      oldcomposite = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = "copy";
      action.color = "rgba(0,0,0,0)";
      $.sketch.tools.marker.draw.call(this, action);
      return this.context.globalCompositeOperation = oldcomposite;
    }
  };
  /*return $.sketch.tools.eraser = {
    onEvent: function(e) {
      switch (e.type) {
        case 'mousedown':
        case 'touchstart':
          this.startPainting();
          break;
        case 'mouseup':
        case 'mouseout':
        case 'touchend':
        case 'touchcancel':
        case 'mouseleave': 
        case 'mouseleave':  
          this.stopPainting();
      }
      if (this.painting) {
        this.action.events.push({
          x: e.pageX - this.canvas.offset().left,
          y: e.pageY - this.canvas.offset().top,
          event: e.type
        });
        return this.redraw();
      }
    },
    draw: function(action) {
      var oldcomposite;
      oldcomposite = this.context.globalCompositeOperation;
      this.context.globalCompositeOperation = "copy";
      var event, previous, _i, _len, _ref;
      this.context.lineJoin = "round";
      this.context.lineCap = "round";
      this.context.beginPath();
      this.context.moveTo(action.events[0].x, action.events[0].y);
      _ref = action.events;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.context.lineTo(event.x, event.y);
        previous = event;
      }
      this.context.strokeStyle = "rgba(0,0,0,0)";
      this.context.lineWidth = action.size;
      this.context.stroke();
      return this.context.globalCompositeOperation = oldcomposite;
    }
  };*/
})(jQuery);