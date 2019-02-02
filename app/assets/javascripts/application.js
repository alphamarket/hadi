const electron = require('electron')
const remote = electron.remote

$(document).ready(function(){
  // fetch the IPC renderer
  const { ipcRenderer } = require('electron')
  // on every form's submit
  $('form').on('submit', function(e) {
    e.preventDefault()
    e.stopPropagation()
    // fetch the form's submit
    let data = $(this).serializeArray().reduce(function(m,o){ m[o.name] = o.value; return m;}, {})
    // append the action should be taken to the data
    data['action'] = $(this).attr('action')
    // send data to index.js
    ipcRenderer.send("on-form-submit", data)
    // receive the handler to perform any actions needed
    ipcRenderer.on("on-form-submit-reply", (event, callback) => {
      try {
        eval("var __callback = " + callback.toString())
        if(typeof(__callback) === "function")
          __callback()
      } catch { /* ignore any exceptions */ }
    })
    // prevent form to really submit
    return false
  });
});

// gets global variables
window._g = (val) => { return remote.getGlobal(val) }
