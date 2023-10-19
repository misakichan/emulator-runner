<script setup lang="ts">
import {onBeforeRouteLeave} from 'vue-router';
import {t} from '../cli/i18n'
import {openConfig} from "../cli/config";
import Default from "../cli/default";

onBeforeRouteLeave((to, from, next) => {
  // 判断数据是否修改
  const shouldSave = window.confirm('是否保存修改？');
  if (shouldSave) {
    // 执行保存操作
  }
  next();
});
console.log(123)
</script>

<template>
  <div class="page-container">
    <div class="page">
      <header class="header">
        <h1 class="md:text-xl">{{ t("emulatorConfig") }}</h1>
        <div class="flex flex-auto items-center justify-end">
          <div class="text-shadow-primary text-primary-600 cursor-pointer text-sm">
            <div @click="openConfig">{{ t('emulator')+t("configFile") }}</div>
          </div>
        </div>
      </header>
      <div class="card settings-card">
        <div class="flex flex-wrap">
          <div class="flex w-full items-center justify-between py-3 px-8 md:w-1/2">
            <span class="label font-bold">{{ t('language') }}</span>
<!--            <div class="button-select">-->
<!--              <button v-for="item in Default.languageOptions"-->
<!--                      :key="item.key"-->
<!--                      :value="item.key"-->
<!--                      :class="{ 'button-select-options': true, 'actived': languageSelected === item.key }"-->
<!--                      @click="languageSelectedUpdate(item.key)"-->
<!--              > {{ item.text }}-->
<!--              </button>-->
<!--            </div>-->
          </div>
        </div>
        <div class="flex flex-wrap">
          <div class="flex w-full items-center justify-between py-3 px-8 md:w-1/2">
            <span class="label font-bold">{{ t('proxy') }}</span>
            <div class="button-select">
              <button v-for="item in Default.proxySelectedOption"
                      :key="item.key"
                      :value="item.key"
                      :class="{ 'button-select-options': true, 'actived': proxySelected === item.key }"
                      @click="proxySelectedUpdate(item.key,!proxyCustomIsOpen,item.key==='custom')">
                {{ item.text }}
              </button>
              <input class="Selected" type="url"
                     v-model="proxyCustom"
                     v-show="proxyCustomIsOpen"
                     style="margin-left: 5px"
                     @blur="githubSelectedUpdate('custom',false,false)"
                     @keydown.enter="proxySelectedUpdate('custom',false,false)"
                     :placeholder="proxyCustom??'https://'">
            </div>
          </div>
        </div>
        <div class="flex flex-wrap">
          <div class="flex w-full items-center justify-between py-3 px-8 md:w-1/2">
            <span class="label font-bold">{{ t('githubProxy') }}</span>
            <div class="button-select">
              <button v-for="item in Default.githubSelectedOption"
                      :key="item.key"
                      :value="item.key"
                      :class="{ 'button-select-options': true, 'actived': githubSelected === item.key }"
                      @click="githubSelectedUpdate(item.key,!githubCustomIsOpen,item.key==='custom')">
                {{ item.text }}
              </button>
              <input class="Selected" type="url"
                     v-model="githubCustom"
                     v-show="githubCustomIsOpen"
                     style="margin-left: 5px"
                     @blur="githubSelectedUpdate('custom',false,false)"
                     @keydown.enter="githubSelectedUpdate('custom',false,false)"
                     :placeholder="githubCustom??'https://'">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>