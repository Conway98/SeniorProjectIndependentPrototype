const electron = require('electron');
const url = require('url');
const path = require('path');
const Main = require('electron/main');
const { createPublicKey } = require('crypto');
const { ppid } = require('process');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let window;

//Listen for app to be ready
app.on('ready', function() {
    //create new window
    window = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    //Load html file into window
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //Quit app when closed
    window.on('closed', function() {
        app.quit();
    });

    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});

//Catch login attempt
ipcMain.on('changeWindow', function(e, secondWindow) {
    window.loadURL(url.format({
        pathname: path.join(__dirname, 'secondWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
});

function createAuthWindow() {
    addWindow = new BrowserWindow({
        width: '50%',
        height: '50%',
        title: 'Login with Discord'
    });
    //Load html into window
    addWindow.loadURL("https://discord.com/api/oauth2/authorize?client_id=946824320435515503&redirect_uri=http%3A%2F%2Flocalhost%3A53134&response_type=code&scope=identify")
}

//Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label: 'Login',
                click(){
                    createAuthWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//If mac, add empty object to menu
if(process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//Add dev tools if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}