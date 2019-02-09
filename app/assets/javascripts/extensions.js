var extend;

extend = function(base, ext) {
  var key;
  for (key in ext) {
    base.prototype[key] = ext[key];
  }
  return base;
};

(function($) {
  var _super;
  _super = {};
  $.fn.extend({
    trigger_all: function(events, params) {
      var el, evts, i;
      el = this;
      i = void 0;
      evts = events.split(' ');
      i = 0;
      while (i < evts.length) {
        el.trigger(evts[i], params);
        i += 1;
      }
      return el;
    }
  });
  _super.focus = $.fn.focus;
  $.fn.focus = function() {
    var v;
    _super.focus.apply(this, arguments);
    v = this.val();
    this.val('');
    this.val(v);
    return this;
  };
  $.fn.highlight = function(term, mark) {
    if (mark == null) {
      mark = "highlight";
    }
    return this.each(function() {
      var pattern, src_str;
      src_str = $(this).html();
      term = term.replace(/(\s+)/, '(<[^>]+>)*$1(<[^>]+>)*');
      pattern = new RegExp("(" + term + ")", 'gi');
      src_str = src_str.replace(pattern, "<mark class='" + mark + "'>$1</mark>");
      src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, '$1</mark>$2<mark>$4');
      return $(this).html(src_str);
    });
  };
  $.fn.actual_height = function() {
    var ah, old_css;
    old_css = this.css(['position', 'visibility', 'display']);
    this.css({
      position: 'absolute',
      visibility: 'hidden',
      display: 'block'
    });
    ah = this.height();
    this.css(old_css);
    return ah;
  };
  $.fn.text_selectable = function(disable_context_menu) {
    if (disable_context_menu == null) {
      disable_context_menu = true;
    }
    this.off('contextmenu').on('contextmenu', function() {
      if (disable_context_menu) {
        return false;
      }
    });
    return this.on('mousedown', function(e) {
      var el, range, sel;
      e.preventDefault();
      sel = void 0;
      range = void 0;
      el = $(this)[0];
      if (window.getSelection && document.createRange) {
        sel = window.getSelection();
        if (sel.toString() === '') {
          window.setTimeout((function() {
            range = document.createRange();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
          }), 1);
        }
      } else if (document.selection) {
        sel = document.selection.createRange();
        if (sel.text === '') {
          range = document.body.createTextRange();
          range.moveToElementText(el);
          range.select();
        }
      }
    });
  };
})(jQuery);

window.location.params = function(name) {
  var params;
  params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
    params[key] = value;
  });
  return params;
};

extend(Number, {
  to_s: function() {
    return this.toString();
  },
  to_i: function() {
    return parseInt(this);
  },
  to_f: function() {
    return parseFloat(this);
  }
});

extend(Array, {
  flatten: function() {
    return this.reduce((function(x, y) {
      if (Array.isArray(y)) {
        return x.concat(y.flatten());
      } else {
        return x.concat(y);
      }
    }), []);
  },
  uniq: function() {
    return this.filter(function(v, i, a) {
      return a.indexOf(v) === i;
    });
  },
  remove: function(item) {
    return this.filter(function(e) {
      return e !== item;
    });
  },
  search: function(item) {
    return this.filter(function(e) {
      return e === item;
    });
  },
  clone: function() {
    return this.slice(0);
  },
  each: function(callback) {
    var index, results;
    index = 0;
    results = [];
    while (index < this.length) {
      if (callback(index, this[index++]) === false) {
        break;
      } else {
        results.push(void 0);
      }
    }
    return results;
  },
  max: function() {
    var index, max;
    index = 0;
    max = -Infinity;
    while (index < this.length) {
      if (this[index++] > max) {
        max = this[index - 1];
      }
    }
    return max;
  },
  min: function() {
    var index, min;
    index = 0;
    min = Infinity;
    while (index < this.length) {
      if (this[index++] < min) {
        min = this[index - 1];
      }
    }
    return min;
  }
});

extend(String, {
  regex_escape: function() {
    return this.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
});
