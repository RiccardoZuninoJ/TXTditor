const { app, BrowserWindow, url, loadURL, Menu, shell } = require('electron');
const path = require('path');
const ipcMain = require('electron').ipcMain;
const { dialog } = require('electron');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let mainWindow;



const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      
    },
    frame: true,
  });
  mainWindow.setMenu(null);
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

let menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'New File',
        click: function(){
          mainWindow.webContents.send('new-file', 'New file');
          
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Save',
        click: function(){
          mainWindow.webContents.send('save', 'Saving file');
          
        },
        sublabel: 'CTRL+S'
      },
      {
        type: 'separator'
      },
      {
        label: 'Save as',
        click: function(){
          mainWindow.webContents.send('save-as', 'Saving file');
                    
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Open',
        click: function(){
          let fileToOpen = dialog.showOpenDialogSync();
          if(fileToOpen != undefined){
            mainWindow.webContents.send('open', fileToOpen);
          }
        }
      },

    ]
  },
  {
    label: 'Info',
    submenu: [
      {
        label: 'GitHub',
        click: function(){
          shell.openExternal('https://github.com/RiccardoZuninoJ/TXTditor');
          
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Follow the Developer',
        click: function(){
          shell.openExternal('https://github.com/RiccardoZuninoJ');
        }
      },
      {
        label: 'Made with Electron',
        click: function(){
          shell.openExternal('https://www.electronjs.org/');
        }
      },

    ]
  }
]);
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('load-page', (event, arg) => {
  loadPage(arg);
  Menu.setApplicationMenu(menu);
});

ipcMain.on('save-file', (event, arg) => {
  let path = dialog.showSaveDialogSync();
  if(path != undefined)
  {
    fs.writeFile(path, arg, (err) =>
    {
      if(err != null)
        return dialog.showErrorBox("Error while saving", toString(err));
    })
    dialog.showMessageBox({"message": "File saved successfully!"});
    mainWindow.webContents.send('saved', path);
  }
});

ipcMain.on('save-notas', (event, arg) => {
  fs.writeFile(arg[0], arg[1], (err) =>
    {
      if(err != null)
        return dialog.showErrorBox("Error while saving", toString(err));
    })
    dialog.showMessageBox({"message": "File saved successfully!"});
});

ipcMain.on('open-file', (event, arg) => {
  let fileToOpen = dialog.showOpenDialogSync();
  if(fileToOpen != undefined){
    Menu.setApplicationMenu(menu);
    loadPage('editor.html');
    mainWindow.webContents.on('did-finish-load', ()=>{
      mainWindow.webContents.send('open', fileToOpen);
    })
    
  }
})

function loadPage(page)
{
  mainWindow.loadFile(path.join(__dirname, page));
}