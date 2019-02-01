
module.exports = {
  create: (app, Menu) ->
    # Each object is a dropdown
    `const mainMenuTemplate =  [
      {
        label: 'File',
        submenu:[
          {
            label:'<span class="fa fa-check"></span> Add Item',
            click(){
              createAddWindow();
            }
          },
          {
            label:'Clear Items',
            click(){
              mainWindow.webContents.send('item:clear');
            }
          },
          {
            label: 'Quit',
            accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
              app.quit();
            }
          }
        ]
      }
    ];`
    # Build menu from template
    mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    # Insert menu
    Menu.setApplicationMenu { }
    return
}
