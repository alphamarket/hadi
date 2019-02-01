electron = require('electron')
path = require('path')
url = require('url')
ejse = require('ejs-electron')
# SET ENV
process.env.NODE_ENV = 'development'

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
