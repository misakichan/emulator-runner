import {ipcRenderer} from 'electron';
import {getConfig} from "./config";
import {useToast} from "vue-toastification";

const toast = useToast()

/**
 * @param key
 * @return {string}
 */
export function t(key: any): any {
    return ipcRenderer.sendSync('i18n', key);
}

export function i18nSetLocale(value: string) {
    let LANG = value
    if (!value) {
        LANG = navigator.language ?? 'en-US'
        const item = getConfig()
        if (!item) {
            toast.error(t('configError'))
        }
        if (item.languageSelected) {
            LANG = item.languageSelected
        }
    }
    if (value === "auto" || LANG === "auto") LANG = navigator.language ?? 'en-US'

    ipcRenderer.sendSync('i18n-setLocale', LANG)
}