electron = require('electron')
path = require('path')
url = require('url')
# SET ENV
process.env.NODE_ENV = 'development'

`const { app, BrowserWindow, Menu, ipcMain } = electron;`

mainWindow = undefined
addWindow = undefined

# Listen for app to be ready
app.on 'ready', ->
  # Create new window
  mainWindow = new BrowserWindow({})
  # Load html in window
  mainWindow.loadURL url.format(
    pathname: path.join(__dirname, '..', 'views/main.html')
    protocol: 'file:'
    slashes: true)
  # Quit app when closed
  mainWindow.on 'closed', ->
    app.quit()
    return
  return
