global.root_path = __dirname
global.app_path  = root_path + "/app"
global.assets_path = app_path + "/assets"
global.upload_path = root_path + "/uploads"
global.database    = root_path + "/database.json"
global.node_modules_path = root_path + "/node_modules"
// load and init database instance
JsonDB = require('node-json-db');
// load the db, auto-store to db, write not-human-readable
global.db = new JsonDB(database, true, false)
// register `.coffee` file extension to get processed
require('coffeescript').register();
// require(app_path + '/controllers/main')
// to enable electron env
const electron = require('electron');
// for `development` env.
if(process.env.NODE_ENV === "development") {
  // for reloading the web content on source change
  require('electron-reload')([
      `${root_path}/**/*.js`,
      `${root_path}/**/*.css`,
      `${root_path}/**/*.ejs`,
    ], {
      electron: require(root_path + "/node_modules/electron")
    });
}
// to compile .ejs files
require('ejs-electron');
// enable the base controller
require(app_path + '/controllers/base_controller');
// include basic helpers
require(`${app_path}/helpers/include_all`)

const url  = require('url');
const path = require('path');
const fs   = require('fs');

// if uploading path folder does not exists?
if(!fs.existsSync(upload_path))
  // create it!
  fs.mkdirSync(upload_path)

const { app, BrowserWindow, Menu, ipcMain } = electron;

mainWindow = void 0;

addWindow = void 0;

// Listen for app to be ready
app.on('ready', function() {
  // Create new window
  mainWindow = new BrowserWindow({
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // maximize the window
  mainWindow.maximize();
  // for `development` env.
  if(process.env.NODE_ENV === "development") {
    mainWindow.toggleDevTools();
  }
  // Load html in window
  mainWindow.loadURL(url.format({
    pathname: path.join(app_path, 'views/home/main.ejs'),
    protocol: 'file:',
    slashes: true
  }));
  // Quit app when closed
  mainWindow.on('closed', function() {
    if (process.platform !== 'darwin') {
      // while preventing the null-write of databse
      if(Object.keys(db.getData('/')).length)
        // save any changes to database
        db.save(true)
      // quit the database
      app.quit();
    }
  });
  // handle forms submission
  ipcMain.on("url-request", (event, arg) => {
    var _path   = arg["$@__action"]
    var _req_id = arg["$@__req_id"]
    var _is_synced = arg["$@__synced"]
    // pre-process incomming args
    arg = $.map(arg, (e) => { return $.to_latin_numeric(e) })
    // for `development` env.
    if(process.env.NODE_ENV === "development") { console.log("url-request", arg) }
    // delete interal args
    delete arg["$@__action"]
    delete arg["$@__req_id"]
    delete arg["$@__synced"]
    var parts  = _path.split('/').filter((e) => { return e.length })
    var action = parts[parts.length - 1]
    parts      = parts.slice(0, parts.length - 1)
    // for each parts of action's path
    for (var i = 0; i < parts.length; i++) {
      var new_path = path.join(app_path, 'controllers/' + parts.slice(0, i + 1).join('/'))
      // check if folder exists?
      if(fs.existsSync(new_path)) {
        // keep diving!
        continue;
      // if the controller file exists?
      } else if(fs.existsSync(new_path + '_controller.coffee')) {
        // build the class name
        _class = parts.slice(0, i + 1).map((e) => { return e[0].toUpperCase() + e.slice(1) }).join("") + "Controller"
        // require the file
        const _import = require(new_path + '_controller.coffee')
        // call the action and get the response
        eval(`response = new _import().${action}_action(arg)`)
        // validate the response
        if(typeof(response) === "undefined" || response === null) response = { }
        // create the response
        var response = JSON.stringify({ req_id: _req_id, response: response })
        // if requesting a synced transmission
        if(_is_synced)
          // attach the response
          event.returnValue = response
        // for un-synced transmission
        else
          // call the action and respond to the submission
          event.sender.send(`url-request-reply-${_path}-${_req_id}`, response)
      }
    }
  });
});
