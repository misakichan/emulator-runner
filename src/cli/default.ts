import {getCurrentInstance} from "vue";
import i18n from "../cli/i18n";
const global = i18n.global
const t = global.t
export default {
    proxySelectedOption: [
        {key: 'none', text: t("none"), value: ""},
        {key: 'Clash', text: "Clash", value: "http://127.0.0.1:7890"},
        {key: 'ShadowSocksR', text: "ShadowSocksR", value: "http://127.0.0.1:1080"},
        {key: 'V2RAY', text: "V2RAY", value: "http://127.0.0.1:10809"},
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