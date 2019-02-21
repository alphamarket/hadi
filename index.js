global.root_path = __dirname
global.app_path  = root_path + "/app"
global.assets_path = app_path + "/assets"
global.upload_path = root_path + "/uploads"
global.database    = root_path + "/base.asar.json"
global.database_extra    = root_path + "/extra.asar.json"
global.node_modules_path = root_path + "/node_modules"
// check if the current program should perform as LIMITED VERSION of itself or not!
global.limited_version = true
// for limited version
if(global.limited_version) {
  // every model can store upto this amount!
  global.limited_version_limit = 10
  global.limited_version_error_msg = `برنامه حاضر به عنوان «نسخه محدود» در حال اجرا می‌باشد لذا ثبت کردن بیشتر از ${limited_version_limit} عدد مقدور نیست. جهت دریافت نسخه کامل این برنامه با برنامه نویس آن هماهنگ شوید.`
}
// for `NOT development` env.
if(process.env.NODE_ENV !== "development") {
  global.upload_path = root_path + "/../uploads"
  global.database    = root_path + "/../base.asar.json"
  global.database_extra    = root_path + "/../extra.asar.json"
  // if we are in a asar file?
  if(root_path.endsWith('.asar')) {
    // exclude the `.asar` file's complications from the resources' path
    global.upload_path = global.upload_path.replace('/app.asar/..', "")
    global.database    = global.database.replace('/app.asar/..', "")
    global.database_extra    = global.database_extra.replace('/app.asar/..', "")
  }
}
// load and init database instance
const JsonDB = require('node-json-db');
// load the db, auto-store to db, write human-readable
global.db = new JsonDB(database, true, false)
global.db_extra = new JsonDB(database_extra, true, false)
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
  // get window width/height
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  // Create new window
  mainWindow = new BrowserWindow({
    frame: false,
    show: false,
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true
    }
  });
  // for `development` env.
  if(process.env.NODE_ENV === "development") {
    mainWindow.toggleDevTools();
  }
  // create a new `splash`-Window
  splash = new BrowserWindow({ width: 810, height: 610, frame: false, alwaysOnTop: true, webPreferences: { nodeIntegration: true } });
  // load the splash screen
  splash.loadURL(url.format({
    pathname: path.join(app_path, 'views/helpers/splash.ejs'),
    protocol: 'file:'
  }));
  // Load html in window
  mainWindow.loadURL(url.format({
    pathname: path.join(app_path, 'views/home/main.ejs'),
    protocol: 'file:'
  }));
  mainWindow.webContents.once('dom-ready', () => {
    // set timout for closing the splash window
    setTimeout(() => {
      // close the splash
      splash.destroy();
      // maximize the window
      mainWindow.show();
    }, 7000) // wait for 10 secs.
  });
  // Quit app when closed
  mainWindow.on('closed', function() {
    if (process.platform !== 'darwin') {
      // while preventing the null-write of database
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
        var _response = JSON.stringify({ req_id: _req_id, response: response })
        // for `development` env.
        if(process.env.NODE_ENV === "development") { console.log("url-request-reply", response) }
        // if requesting a synced transmission
        if(_is_synced)
          // attach the response
          event.returnValue = _response
        // for un-synced transmission
        else
          // call the action and respond to the submission
          event.sender.send(`url-request-reply-${_path}-${_req_id}`, _response)
      }
    }
  });
});
