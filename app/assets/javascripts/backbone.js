// include electron
const electron = require('electron')
// include path
const path     = require('path')
// include file-system
const fs       = require('fs')
// fetch remote param
const remote = electron.remote
// fetch the IPC renderer
const { ipcRenderer } = require('electron')

// gets global variables
window._g = (val) => { return remote.getGlobal(val) }

window.goto = (url) => {
  if(typeof(url) !== "string") return
  $.get({
    url: path.join(_g('app_path'), "views", url + ".ejs" + '?_=' + new Date().getTime()),
    dataType: 'html',
    success: function(data) {
      $('body').html(data.replace(/^.*?<body[^>]*>(.*?)<\/body>.*?$/s,"$1"))
    }
  }).fail(function() {
    alert("خطا در بارگذاری صفحه!");
  })
}

window.is_success_response = (resp) => { return typeof(resp["status"]) === "undefined" || resp["status"].toLowerCase() === "ok" }

window.is_fail_response = (resp) => { return typeof(resp["status"]) !== "undefined" && resp["status"].toLowerCase() === "failed" }

window.response_data = (resp) => { return resp["response"] }

window.send_request = (url, data, __callback) => {
  // create a request pool if not exists
  if(typeof(window.reguest_pool) !== "object") window.request_pool = { }
  // geneate a request id
  var req_id = Object.keys(window.request_pool).length;
  // add the request to the request pool
  window.request_pool[req_id] = {
    url: url,
    data: data,
    callback: __callback
  }
  // append meta data to the original data
  data["$@__action"] = url;
  data["$@__req_id"] = req_id;
  ipcRenderer.send('url-request', data);
  ipcRenderer.once('url-request-reply', (event, data) => {
    // convert to object
    data = JSON.parse(data)
    // fetch request id
    var req_id = data["req_id"]
    // fetch if this is from a valid request
    if(typeof(request_pool[req_id]) !== "object") return;
    // fetch the meta data for the request
    meta = request_pool[req_id]
    // delete from the request pool
    delete request_pool[req_id]
    // convert to json object
    data = data["response"]
    // test if callback is already a function?
    if(typeof(meta.callback) === "function") {
      meta.callback(data)
    // test if callback is passed as a string
    } else if(typeof(meta.callback) === "string") {
      // test if this is inline function?
      if(meta.callback.trim().match(/^function\(.*\)\s*{.*}$/gi)) {
        // [work-around] eval the function and call it with data as its arg.
        eval("var __callback__ = " + meta.callback + "(JSON.parse(data))")
      // test if this is function?
      } else if(typeof(eval(meta.callback)) === "function") {
        // eval the function and call it with data as its arg
        eval(meta.callback)(data)
      }
    }
  })
}

window.to_latin_numeric = function(num) {
  return num.toString().replace(/[\u0660-\u0669\u06F0-\u06F9]/g, function(c) {
    return '0123456789'[c.charCodeAt(0) & 0xf];
  });
};

window.to_persian_numeric = function(num) {
  return num.toString().replace(/[0-9]/g, function(c) {
    return "۰۱۲۳۴۵۶۷۸۹"[c];
  });
};

window.clone = function(obj) {
  var flags, key, newInstance;
  if ((obj == null) || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    flags = '';
    if (obj.global != null) {
      flags += 'g';
    }
    if (obj.ignoreCase != null) {
      flags += 'i';
    }
    if (obj.multiline != null) {
      flags += 'm';
    }
    if (obj.sticky != null) {
      flags += 'y';
    }
    return new RegExp(obj.source, flags);
  }
  newInstance = new obj.constructor();
  for (key in obj) { newInstance[key] = clone(obj[key]); }
  return newInstance;
}

// closes all open modals
window.close_all_models = () => { for (var modal of modals) { modal.close() } }

// send_request('/user/create', {image: read_image(_g('root_path') + "/image.jpg") }, (data) => { console.log(data) })
window.read_image = (path) => { return Buffer.from(fs.readFileSync(path)).toString('base64') }
