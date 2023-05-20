import path from "path";
import {useToast} from "vue-toastification";
import * as fs from "fs";
import {spawn} from "child_process";
import i18n from "./i18n";

const global =i18n.global
const t = global.t
const homeDir = process.env.HOME
const appName = process.env.npm_package_name
const configFileName = 'config.json'
const toast = useToast()
let configFilePath = '';

/**
 * @return {Object}
 */
function get() {
    getConfigPath()
    init()
    const configJson = require(configFilePath)
    if (!configJson.languageSelected) {
        return {}
    }
    return configJson
}

function open() {
    get()
    if (process.platform === 'darwin') {
        // macOS 上使用默认应用程序打开文件
        spawn('open', [path.dirname(configFilePath)]);
        spawn('open', [configFilePath]);
    } else if (process.platform === 'win32') {
        // Windows 上使用记事本打开文件
        spawn('notepad.exe', [path.dirname(configFilePath)]);
        spawn('explorer', [configFilePath]);
    } else {
        // Linux 上使用默认文本编辑器打开文件
        spawn('xdg-open', [configFilePath]);
        spawn('xdg-open', [configFilePath]);
    }
}

function save(data: Object) {
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(data), {encoding: 'utf8', flag: 'w'})
    } catch (e) {
        toast.error(t('saveConfigError') + e)
    }
    toast.success(t('saveConfigSuccess'))
}

function init() {
    getConfigPath()
    if (!fs.existsSync(path.dirname(configFilePath))) {
        // toast.error(t('configFileNotExist'))
        try {
            fs.mkdirSync(path.dirname(configFilePath))
        } catch (e) {
            toast.error(t('makeConfigDirError') + e)
        }
        toast.success(t('makeConfigDirSuccess'))
    }
    if (!fs.existsSync(configFilePath)) {
        // toast.error(t('configFileNotExist'))
        try {
            fs.writeFileSync(configFilePath, fs.readFileSync("/Users/xr/Downloads/config.json"), {
                encoding: 'utf8',
                flag: 'w'
            })
        } catch (e) {
            toast.error(t('makeConfigDirError') + e)
        }
        toast.success(t('makeConfigDirSuccess'))
    }
}

function getConfigPath() {
    if (homeDir) {
        configFilePath = path.join(homeDir, `.${appName}`, configFileName)
    } else {
        toast.error(t('getUserHomePathError'))
    }
}

export default {
    get,
    save,
    open,
    init,
}