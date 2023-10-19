import {createRouter, createWebHashHistory} from "vue-router";
import dashboard from "../components/DashBoard.vue";
import manage from "../components/Manage.vue";
import emulatorConfig from "../components/EmulateConfig.vue";
import setting from "../components/Setting.vue";
import about from "../components/About.vue";

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: dashboard,
        Default: true,
    },
    {
        path: '/manage',
        name: 'manage',
        component: manage
    },
    {
        path: '/config',
        name: 'config',
        component: emulatorConfig
    },
    {
        path: '/setting',
        name: 'setting',
        component: setting
    },
    {
        path: '/about',
        name: 'about',
        component: about
    },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

