<script setup lang="ts">
// const { ipcRenderer } = require('electron');
import {t} from "./cli/i18n";
// import { useRouter } from 'vue-router'

// const router = useRouter()
import {router} from "./cli/router";

function currentRoute() {
  return router.currentRoute.value.path
}

const menuItems = [
  {text: t('dashboard'), path: "/"},
  {text: t('manage'), path: "/manage"},
  {text: t('repo'), path: "/repo"},
  {text: t('setting'), path: "/setting"},
  {text: t('about'), path: "/about"},
]
// console.log(`app path is __dirname ${__dirname} __filename ${__filename} ipcRenderer.invoke('getAppPath') ${ipcRenderer.invoke('getAppPath')}`)
</script>

<template>
  <div class="sidebar">
    <img src="./static/icon.png" alt="logo" class="sidebar-logo">
    <ul class="sidebar-menu">
      <li v-for="item in menuItems" class="item">
        <a :class="{ 'active': item.path === currentRoute() }" @click="router.push(item.path)">
          {{ item.text }}
        </a>
      </li>
    </ul>
    <div class="sidebar-version">
      <span class="sidebar-version-label">软件版本</span>
      <span class="sidebar-version-text">v0.0.1</span>
    </div>
  </div>
  <router-view></router-view>
</template>

<style scoped>
@keyframes spinner {
  0% {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.sidebar {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  display: flex;
  width: 160px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
}

.sidebar-logo {
  margin-top: 50px;
  width: 60px;
  height: 60px;
}

.sidebar-menu {
  display: flex;
  margin-top: 12px;
  flex-direction: column;
  flex: 1;
}

.sidebar-menu .item {
  display: block;
  margin-top: 18px;
}

.sidebar-menu .item > a {
  display: block;
  width: 120px;
  height: 36px;
  border-radius: 18px;
  text-align: center;
  font-size: 14px;
  line-height: 36px;
}

.sidebar-menu .item > a, .sidebar-menu .item a:active, .sidebar-menu .item a:visited {
  color: #909399;
  text-decoration: none;
}

.sidebar-menu .item > a.active {
  background: linear-gradient(135deg, #57befc, #2c8af8);
  box-shadow: 0 2px 8px #2c8af880;
  color: #fff;
}

.sidebar-version {
  display: flex;
  padding-bottom: 20px;
  flex-direction: column;
  align-items: center;
}

.sidebar-version-label {
  color: #2c8af8;
  text-shadow: 0 2px 6px rgba(44, 138, 248, .4);
  font-size: 14px;
}

.sidebar-version-text {
  margin: 8px 0;
  padding: 0 10px;
  color: #54759a;
  text-align: center;
  font-size: 14px;
}

img {
  display: block;
  height: auto;
  max-width: 100%;
  border-style: solid;
  vertical-align: middle;
}

/*input::webkit-input-placeholder {*/
/* opacity: 1; */
/*    color:#9ca3af*/
/*;;;;;;;;;;}*/

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>