import {createApp} from 'vue'
import App from './App.vue'
import './samples/node-api'
import {createRouter, createWebHistory} from "vue-router";
import Toast, {useToast, type PluginOptions} from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import i18n from "./cli/i18n";

const {t} = i18n.global
const routes = [
    {
        path: '/',
        name: t('dashboard'),
        component: () => import('./components/DashBoard.vue'),
        Default: true,
    },
    {
        path: '/manage',
        name: t('manage'),
        component: () => import('./components/Manage.vue')

    },
    {
        path: '/repo',
        name: t('repo'),
        component: () => import('./components/Repo.vue')
    },
    {
        path: '/setting',
        name: t('setting'),
        component: import('./components/Setting.vue')
    },
    {
        path: '/about',
        name: t('about'),
        component: import('./components/About.vue')
    },
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
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

app.use(i18n)
app.use(Toast, toastOptions)
app.use(router)
app.mount('.app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })