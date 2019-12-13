const { app, BrowserWindow } = require("electron");

const { ipcMain } = require("electron");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 1100, height: 900, backgroundColor: "#ffd47f", title: "Juicy Data Uploader" });
  win2 = new BrowserWindow({ width: 1100, height: 900, backgroundColor: "#009933", title: "Juicy Data Uploader" });

  if (process.env.NODE_ENV) {
    win.setBounds({ x: 1921, y: 0, width: 1920, height: 1080 });
    win.maximize();
    win.webContents.openDevTools();
    win2.setBounds({ x: 1921, y: 0, width: 1920, height: 1080 });
    win2.maximize();
    win2.webContents.openDevTools();
  }

  win.setMenu(null);
  win2.setMenu(null);

  win.loadFile("index.html");
  win2.loadFile("lowerthirds.html");

  win.setTitle("Juicy Data Uploader");
  win2.setTitle("Juicy Data Uploader");

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
  win2.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win2 = null;
  });

  // Attach event listener to event that requests to update something in the second window
  // from the first window
  ipcMain.on("request-lower-thirds-update", (event, arg) => {
    // Request to update the label in the renderer process of the second window
    // We'll send the same data that was sent to the main process2
    // Note: you can obviously send the
    win2.webContents.send("action-lower-thirds-update", arg);
  });
}

app.commandLine.appendSwitch('disable-gpu-compositing')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});
