import {getCurrentInstance} from "vue";

import {t} from "./i18n";

export default {
    proxySelectedOption: [
        {key: 'none', text: t("none"), value: ""},
        {key: 'clash', text: "Clash", value: "http://127.0.0.1:7890"},
        {key: 'ssr', text: "Shadowsocks", value: "http://127.0.0.1:1080"},
        {key: 'v2ray', text: "V2Ray", value: "http://127.0.0.1:10809"},
        {key: 'custom', text: t("custom"), value: "http://127.0.0.1:10809"}
    ],
    githubSelectedOption: [
        {key: 'none', text: t("none")},
        {key: 'ghproxy', text: "ghproxy"},
        {key: 'custom', text: t("custom")}
    ],
    languageOptions: [
        {key: 'zh-CN', text: '中文'},
        {key: 'auto', text: t('auto')},
        {key: 'en-US', text: 'English'}
    ]
}