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
  $('body').append('<div class="valign-wrapper center-align truncate font-fa-nastaliq disable-page">\
    <center>\
      <strong class="font-34">در حال پردازش...</strong>\
      <div class="hide progress transparent w-40">\
        <div class="indeterminate green"></div>\
      </div>\
    </center>\
  </div>');
  window.location = path.join(_g('app_path'), "views", url + ".ejs")
}

window.send_request = (url, data, __callback) => {
  data["$@__action"] = url;
  ipcRenderer.send('url-request', data);
  ipcRenderer.on('url-request-reply', (event, data) => {
    // convert to json object
    data = JSON.parse(data)
    // test if callback is already a function?
    if(typeof(__callback) === "function") {
      __callback(data)
    // test if callback is passed as a string
    } else if(typeof(__callback) === "string") {
      // test if this is inline function?
      if(__callback.trim().match(/^function\(.*\)\s*{.*}$/gi)) {
        // [work-around] eval the function and call it with data as its arg.
        eval("var __callback__ = " + __callback + "(JSON.parse(data))")
      // test if this is function?
      } else if(typeof(eval(__callback)) === "function") {
        // eval the function and call it with data as its arg
        eval(__callback)(data)
      }
    }
  })
}

window.read_image = (path) => { return Buffer.from(fs.readFileSync(path)).toString('base64') }

$(document).ready(function(){
  // catch links with valid links and relocate the window as desired!
  $('a[href]:not([href^="#"])').click((e) => {
    e.preventDefault();
    goto($(e.target).attr('href'))
  })
  // send_request('/user/create', {image: read_image(_g('root_path') + "/image.jpg") }, (data) => { console.log(data) })
  // on every form's submit
  $('form').on('submit', function(e) {
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
});
