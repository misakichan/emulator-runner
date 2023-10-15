import {createApp} from 'vue'
import App from './App.vue'
import './samples/node-api'
import Toast, {useToast, type PluginOptions} from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import {t, i18nSetLocale} from './cli/i18n'
import {router} from "./cli/router";

i18nSetLocale("")


const app = createApp(App)
let count = 0
const toastOptions: PluginOptions = {
    filterBeforeCreate: (toast: any, toasts: any) => {
        if (toasts.filter((t: any) => t.type === toast.type).length !== 0) {
            count += 1
            toast.content += ` ${count}`
            useToast().clear()
            return toast
        }
        count = 1
        return toast
    },

}

app.use(Toast, toastOptions)
app.use(router)
app.mount('.app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    }).then(r => r)