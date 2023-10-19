import {
    app,
    BrowserWindow,
    shell,
    ipcMain,
    webContents,
    globalShortcut,
    MenuItemConstructorOptions,
    MenuItem,
    Menu,
    Tray, dialog
} from 'electron'
import {release} from 'node:os'
import {join, dirname} from 'node:path'
import i18n from "i18n";
import os from "os";
import {spawn} from "child_process";
import {writeFileSync, readFileSync, existsSync} from "fs";
import {xml2json} from "xml-js";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST
process.env.configFilePath = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../config.json')
    : join(process.env.DIST_ELECTRON, '../../config.json')

//禁止程序多开，此处需要单例锁的打开注释即可
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
}

// 多语言化
i18n.configure({
    locales: ["zh-CN", "en-US"],
    directory: join(process.env.VITE_PUBLIC, "locales"), // TODO 这里有文件位置
    defaultLocale: 'en-US',
    register: global,
});


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let staticPath = join(app.getAppPath(), '/src/static')
let tmp_path = app.getAppPath()
if (tmp_path.includes('/Contents/Resources/')) {
    process.env.configFilePath = join(app.getAppPath(), '../../config.json')
    staticPath = join(app.getAppPath(), '../../Resources/')
}
let sdkPath: string;
switch (process.platform) {
    case 'darwin':
        sdkPath = join(os.homedir(), 'Library', 'Android', 'sdk');
        break;
    case 'win32':
        sdkPath = join(os.homedir(), 'AppData', 'Local', 'Android', 'sdk');
        break;
    case 'linux':
        sdkPath = join(os.homedir(), 'Android', 'sdk');
        break;
    default:
        console.log('Unknown platform ' + process.platform);
}

// xml2json(readFileSync(join(app.getAppPath(), 'addons_list-5.xml')).toString(), {compact: true, spaces: 4});
let configDateDefault = {
    "configFilePath": process.env.configFilePath,
    "sdkPath": sdkPath,
    "languageSelected": "auto",
    "VITE_PUBLIC": process.env.VITE_PUBLIC,
}
// ----------------------------------------------------------------------

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
const isMac = process.platform === 'darwin'
// submenu: [
//     {role: 'about'},
//     {role: 'settings'},
//     {type: 'separator'},
//     {role: 'services'},
//     {type: 'separator'},
//     {type: 'separator'},
//     {role: 'quit'}
// ]


// {
//     role: 'help',
//     submenu: [
//         {
//             label: 'Learn More',
//             click: async () => {
//                 const {shell} = require('electron')
//                 await shell.openExternal('https://electronjs.org')
//             }
//         }
//     ]
// }
async function createWindow() {
    win = new BrowserWindow({
        // title: 'Main window',
        width: 920,
        height: 580,
        minWidth: 920,
        minHeight: 580,
        // autoHideMenuBar: true,
        // frame: true,
        titleBarStyle: 'hiddenInset',
        icon: join(process.env.VITE_PUBLIC, 'icon.png'),
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            // 如果是开发模式可以使用devTools 调试
            // devTools: process.env.NODE_ENV === "development",
            devTools: true,
            // 在macos中启用橡皮动画
            scrollBounce: process.platform === "darwin",
        },
        // transparent: true, //设置透明
    })

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        win.loadURL(url)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({url}) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return {action: 'deny'}
    })
    // win.webContents.on('will-navigate', (event, url) => { }) #344
}


app.whenReady().then(() => {
        createWindow();
        // --------------------------------托盘--------------------------------

        const trayModel = new Tray(join(__dirname, '../../src/assets/tray.png'))
        const contextMenu = Menu.buildFromTemplate([
            {
                role: 'quit',
                label: i18n.__('exit'),
                click: () => {
                    app.quit()
                }
            }
        ])
        trayModel.setToolTip(app.name)
        trayModel.on('right-click', () => {
            trayModel.popUpContextMenu(contextMenu)
        })
        trayModel.on('click', (e, bounds) => {
            win ? win.show() : createWindow()
        })
        // --------------------------------托盘--------------------------------
        // const menu = Menu.buildFromTemplate(menuBars)
        // Menu.setApplicationMenu(menu)
        setTimeout(() => {
            // getConfig.getConfig()
        }, 2000)
    }
)

app.on('window-all-closed', () => {
    console.log('window-all-closed')
    win = null
    // 在 macOS 上，应用程序在所有窗口关闭后仍然需要手动退出
    if (process.platform !== 'darwin') app.quit();

    // 隐藏窗口并将其缩小到菜单栏
    if (win && !win.isDestroyed() && !win.isVisible()) {
        console.log('hide')
        win.hide();
    }
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, {hash: arg})
    }
})


// ----------------------------------------------------------------------
ipcMain.on('i18n', (event, arg) => {
    event.returnValue = i18n.__(arg)
})
ipcMain.on('i18n-setLocale', (event, arg) => {
    i18n.setLocale(arg)
    event.returnValue = true
})

ipcMain.on('getAppPath', (event) => {
    // event.reply('getAppPath-reply', i18nConfig.directory)
    event.returnValue = app.getAppPath()
    return
})
ipcMain.on('saveConfig', (event, args) => {
    let item = getConfigHandle()
    if (item.error) {
        event.returnValue = item
        return;
    }
    if (JSON.stringify(item.result) === args || !args) {
        item.msg = i18n.__('configNoChange')
        event.returnValue = item
        return;
    }
    try {
        writeFileSync(process.env.configFilePath, args, {encoding: 'utf8', flag: 'w'})
    } catch (e) {
        console.log(e)
        event.returnValue = {error: e, msg: i18n.__('saveConfigError'), result: args}
        return
    }
    event.returnValue = {error: null, msg: i18n.__('saveConfigSuccess'), result: args}
})
ipcMain.on('getConfig', (event, args) => {
    event.returnValue = getConfigHandle()
    return;
})

ipcMain.on('openConfig', (event, args) => {
    let item = getConfigHandle()
    if (item.error) {
        event.returnValue = item
        return;
    }
    if (process.platform === 'darwin') {
        // macOS 上使用默认应用程序打开文件
        spawn('open', [dirname(process.env.configFilePath)]);
        spawn('open', [process.env.configFilePath]);
    } else if (process.platform === 'win32') {
        // Windows 上使用记事本打开文件
        spawn('notepad.exe', [dirname(process.env.configFilePath)]);
        spawn('explorer', [process.env.configFilePath]);
    } else {
        // Linux 上使用默认文本编辑器打开文件
        spawn('xdg-open', [process.env.configFilePath]);
        spawn('xdg-open', [process.env.configFilePath]);
    }
    item.msg = i18n.__('openConfigSuccess')
    item.result = args
    event.returnValue = item
    return
})

function getConfigHandle(): { error: Error, msg: string, result: any } {
    let item = initConfigHandle()
    if (item.error) {
        console.log("getConfigHandle error", item.error)
        return {error: item.error, msg: item.msg, result: configDateDefault}
    }
    let configJson: any
    try {
        configJson = JSON.parse(readFileSync(process.env.configFilePath).toString());
        configJson.configFilePath = process.env.configFilePath;
        configJson.sdkPath = sdkPath;
        configJson.VITE_PUBLIC = process.env.VITE_PUBLIC;
    } catch (e) {
        console.log(e)
        return {
            error: e,
            msg: i18n.__('readConfigError'),
            result: configDateDefault
        };
    }
    if (!configJson.languageSelected) return {
        error: new Error("configError"),
        msg: i18n.__('configError'),
        result: configDateDefault
    };

    return {error: null, msg: i18n.__('getConfigSuccess'), result: configJson}
}

function initConfigHandle(): { error: Error, msg: string } {
    if (!existsSync(process.env.configFilePath)) {
        console.log("initConfigHandle file")
        try {
            writeFileSync(process.env.configFilePath, JSON.stringify(configDateDefault), {
                encoding: 'utf8',
                flag: 'w'
            })
            return {error: null, msg: i18n.__('touchConfigSuccess')}
        } catch (e) {
            return {error: e, msg: i18n.__('touchConfigError')}
        }
    }
    return {error: null, msg: i18n.__('initConfigSuccess')}
}

// ----------------------------------------------------------------------




