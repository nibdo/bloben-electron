import * as path from "path";
import * as electron from "electron";
const { BrowserWindow, Menu } = electron;
const isMac = process.platform === "darwin";

function createNetworkWindow() {
  const window = new BrowserWindow({
    show: true,
    autoHideMenuBar: true,
    modal: true,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: true,
      contextIsolation: false,
    },
  });

  window.loadFile(path.join(__dirname, "/html/network.html"));
}

function createLogWindow() {
  const window = new BrowserWindow({
    show: true,
    autoHideMenuBar: true,
    modal: true,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: true,
      contextIsolation: false,
    },
  });

  window.loadFile(path.join(__dirname, "/html/logs.html"));
}
function createAboutWindow() {
  const window = new BrowserWindow({
    show: true,
    autoHideMenuBar: true,
    modal: true,
    width: 300,
    height: 400,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      devTools: true,
      contextIsolation: false,
    },
  });

  window.loadFile(path.join(__dirname, "/html/about.html"));
}

export const menu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      // @ts-ignore
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      // @ts-ignore
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Logs",
        click: () => {
          createLogWindow();
        },
      },
      {
        label: "Network",
        click: () => {
          createNetworkWindow();
        },
      },
      {
        label: "About",
        click: () => {
          createAboutWindow();
        },
      },
    ],
  },
]);
