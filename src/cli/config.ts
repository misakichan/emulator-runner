import {ipcRenderer} from 'electron';
import {useToast} from "vue-toastification";
import {t} from './i18n'
import {it} from "node:test";

const toast = useToast()

export function getConfig(): any {
    let item = ipcRenderer.sendSync('getConfig', null);
    if (item.error) {
        toast.error(t(item.msg))
    }
    return item.result
}

export function openConfig() {
    let item = ipcRenderer.sendSync('openConfig', null);
    if (item.error) {
        toast.error(t(item.msg))
        return
    }
    return
}

export function saveConfig(value: Object): Object {
    console.log("saveConfig", value)
    let item = ipcRenderer.sendSync('saveConfig', JSON.stringify(value, null, 2));
    if (item.error) {
        toast.error(t(item.msg))
        console.log("saveConfig", item.error)
        return {}
    }
    return JSON.parse(item.result)
}


export function reload(): any {
    ipcRenderer.sendSync('saveConfig', null);
}