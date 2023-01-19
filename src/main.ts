import * as electron from "electron";
const { app, BrowserWindow, Menu, ipcMain } = electron;
import * as path from "path";
import * as isDev from "electron-is-dev";
import * as url from "url";
import {log, logNetwork} from "./logger";
import { menu } from "./menu";
const os = require("os");
const windowStateKeeper = require("electron-window-state");

export let mainWindow: any;
let appVersion = "";

async function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 900,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      webSecurity: false,
      // eslint-disable-next-line no-undef
      preload: isDev
        ? path.join(__dirname, "preload.js")
        : path.join(__dirname, "preload.js"),
      devTools: true,
    },
    icon: __dirname + "/icon.png",
  });

  // mainWindow.loadURL(
  //   url.format({
  //     pathname: isDev
  //       ? `${__dirname}/calendar/index.html`
  //       : `${__dirname}/calendar/index.html`,
  //     protocol: "file",
  //     slashes: true,
  //   })
  // );

  await mainWindow.loadFile(path.join(`${__dirname}/calendar/index.html`));

  log("Main window created");

  mainWindowState.manage(mainWindow);

  return mainWindow;
}

const getAppVersion = () => {
  const packageFile = require(__dirname + "/../package.json");

  appVersion = packageFile?.version;
};

async function createHiddenWindow() {
  const worker = new BrowserWindow({
    show: false,
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: true,
      contextIsolation: false,
    },
  });

  await worker.loadFile(path.join(__dirname, "html/worker.html"));

  log("Worker window created");

  return worker;
}

Menu.setApplicationMenu(menu);

app.whenReady().then(async () => {
  log(``);
  log(``);
  log(`Starting app`);
  log("App is ready");

  const [workerWindow, mainWindow] = await Promise.all([createHiddenWindow(), createWindow()]);

  ipcMain.on(
    "api-request",
    (originalEvent, { method, path, body, responseId }) => {
      workerWindow.webContents.send("api-server", {
        method,
        path,
        body,
        responseId,
      });
      logNetwork({type: 'request', method, path, responseID: responseId})
    }
  );
  ipcMain.on("api-server", (listener, data) => {
    mainWindow.webContents.send(data.responseId, {
      statusCode: data.statusCode,
      status: data.status,
      data: data.data,
    });
    logNetwork({type: 'response', responseID: data.responseId, statusCode: data.statusCode,
      status: data.status})
  });

  ipcMain.on("api-socket", (listener, data) => {
    mainWindow.webContents.send("sockets", data);
  });

  getAppVersion();

  mainWindow.show();

  log(`BUILD: ${appVersion}`);
  log(`PLATFORM: ${os.platform()}`);

  mainWindow.on('close', function () {
    app.quit();
  })

  workerWindow.on('close', function () {
    app.quit();
  })
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

module.exports = {};
