const electron = require("electron");
const app = electron.app;
const browerWindow = electron.BrowserWindow;

let mainWindow = null;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("ready", () => {
  mainWindow = new browerWindow();
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});
