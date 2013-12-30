/*jshint strict: true */
/*global alert console pystringformat */
_c = (function() {
  'use strict';
  var fmt;
  if (typeof pystringformat === 'undefined') {
    fmt = function() {
      var str = arguments[0], i, r;
      for (i = 1; i < arguments.length; i++) {
        r = new RegExp("\\{" + (i - 1 ) + "\\}", "g");
        if (r.test(str)) {
          r.lastIndex = 0; // Reset regexp
          str = str.replace(r, String(arguments[i]));
        } else {
          str = str.replace("{}", String(arguments[i]));
        }
      }
      return str;
    };
  } else {
    fmt = pystringformat;
  }
  
  
  var me = {
    forEachKeyValue: function(obj, fn) {
      var key = null;
      for(key in obj) {
        if (obj.hasOwnProperty(key)) {
          fn(key, obj[key]);
        }
      }
    },
    
    /**
     * Iterate over an array
     *
     * @param {Array} arr  the array
     * @param {Function} fn  callback is called with fn(item, index)
     */
    each: function(arr, fn) {
      var i;
      for (i=0;i<arr.length;i++) {
        fn(arr[i], i);
      }
    },

    filter: function(arr, fn) {
      var ret = [], i;
      for(i=0;i<arr.length;i++) {
        if (fn(arr[i])) {
          ret.push(arr[i]);
        }
      }
      return ret;
    },

    /**
     * Very basic string formatter for positional and non-positional arguments,
     * python String.format style.
     *
     * Examples:
     *
     *   _c.fmt("{}, {}!", "Hello", "world");
     *   _c.fmt("Someone please call {0} {0} {1}", "one", "two");
     *
     */
    fmt: fmt,
    
    log: function() {
      console.log(me.fmt.apply(me, arguments));
    },
    
    assert: function(condition, msg) {
      if (!condition) {
        throw(me.fmt("Assertion failed: {}", msg || "(no message)"));
      }
    },
    
    // Shallow copy of a dictionary, skip inherited
    copyDict: function(obj) {
      var ret = {}, key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          ret[key] = obj[key];
        }
      }
      return ret;
    },
    /**
     * Make a deep copy of a json object (objects and arrays)
     */
    deepCopyJson: function(obj) {
      var ret, key, value;
      if (obj.indexOf && !obj.hasOwnProperty("indexOf")) {
        ret = [];
      } else {
        ret = {};
      }
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          value = obj[key];
          if (typeof value === "object") {
            ret[key] = me.deepCopyJson(value);
          } else {
            ret[key] = value;
          }
        }
      }
      return ret;
    },
    before: function(str, delim) {
     var i = str.indexOf(delim);
     if (i === -1) {
       return null;
     }
     return str.substr(0, i);
   },

    after: function(str, delim) {
      var i = str.indexOf(delim);
      if (i === -1) {
        return null;
      }
      return str.substr(i+delim.length);
    }


  };
  
  return me;
})();
