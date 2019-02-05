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

window.read_image = (path) => { return Buffer.from(fs.readFileSync(path)).toString('base64') }

window.refresh_events = () => {
  // catch links with valid links and relocate the window as desired!
  $('a[href]:not([href^="#"])').off('click').on('click', (e) => {
    e.preventDefault();
    goto($(e.target).attr('href'))
  })
  // trigger refersh events on ajax complete
  $(document).off("ajaxSuccess").ajaxSuccess(refresh_events);
  // send_request('/user/create', {image: read_image(_g('root_path') + "/image.jpg") }, (data) => { console.log(data) })
  // on every form's submit
  $('form').off('submit').on('submit', function(e) {
    e.preventDefault()
    e.stopPropagation()
    // fetch the form's submit
    let data = $(this).serializeArray().reduce(function(m,o){ m[o.name] = o.value; return m;}, {})
    // append the action should be taken to the data
    send_request($(this).attr('action'), data, $(this).attr('callback'))
    // send data to index.js
    // ipcRenderer.send("on-form-submit", data)
    // // receive the handler to perform any actions needed
    // ipcRenderer.on("on-form-submit-reply", (event, callback) => {
    //   try {
    //     eval("var __callback = " + callback.toString())
    //     if(typeof(__callback) === "function")
    //       __callback()
    //   } catch { /* ignore any exceptions */ }
    // })
    // prevent form to really submit
    return false
  });
}

$(document).ready(refresh_events);
