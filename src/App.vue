<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'

console.log("[App.vue]", `Hello world from Electron ${process.versions.electron}!`)
</script>

<template>
    <div id="root">
        <div class="app">
            <div class="sidebar">
                <img src="./assets/icon.png" alt="logo" class="sidebar-logo">
                <ul class="sidebar-menu">
                    <li class="item"><a class="active" href="#/proxies" aria-current="page">控制中心</a></li>
                    <li class="item"><a class="" href="#/logs">SDK 管理</a></li>
                    <li class="item no-mobile"><a class="" href="#/rules">SDK 仓库</a></li>
                    <!--                <li class="item no-mobile"><a class="" href="#/connections">连接</a></li>-->
                    <li class="item"><a class="" href="#/settings">设置</a></li>
                </ul>
                <div class="sidebar-version"><span class="sidebar-version-label">软件版本</span><span
                        class="sidebar-version-text">v0.0.1</span></div>
            </div>
            <HelloWorld msg="Electron + Vite + Vue"/>
        </div>
    </div>
</template>