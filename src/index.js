const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "assets", "config.json");
let config = JSON.parse(fs.readFileSync(configPath));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// initializing dom
ipcMain.on("dom-loaded", (e) => {
  e.sender.send("load-config", config);
});

// choosing videos
ipcMain.on("choose-videos", (e) => {
  const _files = dialog.showOpenDialogSync({
    properties: ["openFile", "multiSelections"],
  });
  if (_files !== undefined) {
    let videos = [];
    _files.forEach((_file) => {
      if (path.extname(_file) == ".mp4") {
        videos.push({
          title: path.basename(_file),
          path: _file,
          type: "vid",
        });
      }
    });
    config.videos = videos;
    config["last-played"] = "videos";
    fs.writeFileSync(configPath, JSON.stringify(config));
    e.sender.send("videos", videos);
  }
});

// choosing folders / playlist
ipcMain.on("choose-folder", (e) => {
  const _dir = dialog.showOpenDialogSync({
    properties: ["openDirectory"],
  });
  if (_dir !== undefined) {
    let playlist = [];
    fs.readdirSync(_dir[0]).forEach((_path) => {
      try {
        if (fs.lstatSync(_path).isDirectory()) {
          playlist.push({
            title: _path,
            path: path.join(_dir[0], _path),
            type: "dir",
          });
        } else if (path.extname(_path) == ".mp4") {
          playlist.push({
            title: _path,
            path: path.join(_dir[0], _path),
            type: "vid",
          });
        }
      } catch (err) {
        if (path.extname(_path) == ".mp4") {
          playlist.push({
            title: _path,
            path: path.join(_dir[0], _path),
            type: "vid",
          });
        }
      }
    });
    config.playlist = playlist;
    config["last-played"] = "playlist";
    config["playlist-path"] = _dir[0];
    fs.writeFileSync(configPath, JSON.stringify(config));
    e.sender.send("playlist", playlist, _dir[0]);
  }
});

// listing items in folder
ipcMain.on("list-folder", (e, folder) => {
  let playlist = [];
  fs.readdirSync(folder).forEach((_path) => {
    try {
      if (fs.lstatSync(_path).isDirectory()) {
        playlist.push({
          title: _path,
          path: path.join(folder, _path),
          type: "dir",
        });
      } else if (path.extname(_path) == ".mp4") {
        playlist.push({
          title: _path,
          path: path.join(folder, _path),
          type: "vid",
        });
      }
    } catch (err) {
      if (path.extname(_path) == ".mp4") {
        playlist.push({
          title: _path,
          path: path.join(folder, _path),
          type: "vid",
        });
      }
    }
  });
  config.playlist = playlist;
  config["last-played"] = "playlist";
  config["playlist-path"] = folder;
  fs.writeFileSync(configPath, JSON.stringify(config));
  e.sender.send("playlist", playlist, folder);
});

// update settings
ipcMain.on("update-settings", (e, settings) => {
  config["forward-track"] = settings["forward-track"];
  config["rewind-track"] = settings["rewind-track"];
  config["increase-volume"] = settings["increase-volume"];
  config["decrease-volume"] = settings["decrease-volume"];
  fs.writeFileSync(configPath, JSON.stringify(config));
});
