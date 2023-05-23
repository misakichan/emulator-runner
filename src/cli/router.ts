import {t} from "./i18n";
import {createRouter, createWebHistory} from "vue-router";

import dashboard from "../components/DashBoard.vue";
import manage from "../components/Manage.vue";
import repo from "../components/Repo.vue";
import setting from "../components/Setting.vue";
import about from "../components/About.vue";

const routes = [
    {
        path: '/',
        name: t('dashboard'),
        component: dashboard,
        Default: true,
    },
    {
        path: '/manage',
        name: t('manage'),
        component: manage

    },
    {
        path: '/repo',
        name: t('repo'),
        component: repo
    },
    {
        path: '/setting',
        name: t('setting'),
        component: setting
    },
    {
        path: '/about',
        name: t('about'),
        component: about
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

