// import { lstat } from 'node:fs/promises'
// import { cwd } from 'node:process'
// import {app, ipcMain, ipcRenderer} from 'electron'
//
// ipcRenderer.on('main-process-message', (_event, ...args) => {
//   console.log('[Receive Main-process message]:', ...args)
// })

// ipcMain.handle('getAppPath', () => {
//     return app.getAppPath();
// })
//
// ipcMain.handle('getName', (event) => {
//     return app.getName();
// });


// lstat(cwd()).then(stats => {
//   console.log('[fs.lstat]', stats)
// }).catch(err => {
//   console.error(err)
// })

