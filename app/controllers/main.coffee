# to enable electron env
electron = require('electron')
# for reloading the web content on source change
require('electron-reload')(root_path)
# to compile the scss files
require('electron-middle-sass')
# to compile .ejs files
require('ejs-electron')
# set ENV
process.env.NODE_ENV = 'development'

path = require('path')
url = require('url')

`const { app, BrowserWindow, Menu, ipcMain } = electron;`

mainWindow = undefined
addWindow = undefined

global.xapp = app

# Listen for app to be ready
app.on 'ready', ->
  # Create new window
  mainWindow = new BrowserWindow({ frame: false })
  # Load html in window
  mainWindow.loadURL url.format(
    pathname: path.join(app_path, 'views/home/main.ejs')
    protocol: 'file:'
    slashes: true)
  # Quit app when closed
  mainWindow.on 'closed', ->
    app.quit()
    return
  return
