import {createI18n, useI18n} from "vue-i18n";
// import {app} from 'electron'
import zh from "./zh";
import en from "./en";
import * as os from "os";

let locale = localStorage.getItem('locale') ?? navigator.language
const information = document.getElementById('info')
try {
    const config = require(`${os.homedir()}/.emulator-runner/config.json`);
    locale = config.languageSelected ?? locale
    if (locale === "auto") locale = navigator.language
    console.debug("system default language1: " + locale)
} catch (e) {
    // console.log(`${os.homedir()}/.${remote.app.getName()}/config.json`)
    console.debug("system default language2: " + locale, e)
}

const i18n = createI18n({
    legacy: true,
    locale: locale, // 使用系统语言
    fallbackLocale: locale,
    globalInjection: true,
    messages: {'zh-CN': zh, 'en-US': en}
})

export default i18n