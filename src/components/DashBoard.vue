<script setup lang="ts">
import {ref} from 'vue'
import {t} from '../cli/i18n'
import path from "path";
import {getConfig} from "../cli/config";
import * as stream from "stream";
import {useToast} from "vue-toastification";

const toast = useToast()

const config = ref(getConfig())
const {exec} = require('child_process');
const emulatorLists = ref({} as { [key: string]: any });
const emulatorPath = path.join(config.value.sdkPath, 'emulator', 'emulator')

defineProps<{ msg: string }>()

function emulatorListApp() {
  let logs = ""
  const childProcess = exec(`${emulatorPath} -list-avds`)
  childProcess.stdout.on('data', (data: any) => {
    logs = logs.concat(data.toString());
  });
  childProcess.on('exit', () => {
    logs.split('\n').filter((line: any) => {
      // let name = line.trim().split(/\n/)
      if (line === "") {
        return
      }
      if (emulatorLists.value[line] === undefined) {
        emulatorLists.value[line] = {pid: 0, logs: ''}
      }
    })
    if (Object.keys(emulatorLists.value).length === 0) {
      toast.info(t('noEmulator'))
      return
    }
  });
}

function getEmulatorLogs(name: string) {
  if (!emulatorLists.value[name].logs) emulatorLists.value[name].logs = ""
  console.log(emulatorLists.value[name].logs)
}

function getEmulatorRunners() {
  // 带有命令行的list进程命令是：“cmd.exe /c wmic process list full”
  //  tasklist 是没有带命令行参数的。可以把这两个命令再cmd里面执行一下看一下效果
  // 注意：命令行获取的都带有换行符，获取之后需要更换换行符。可以执行配合这个使用 str.replace(/[\r\n]/g,""); 去除回车换行符
  let cmd = process.platform === 'win32' ? 'tasklist' : 'ps -exa | grep -v grep | grep emulator | grep qemu'
  exec(cmd, function (err: any, stdout: any, stderr: any) {
    if (stdout === "") {
      toast.error(t('noRunningEmulator'))
      return
    }
    stdout.split('\n').filter((line: any) => {
      let processMessage = line.trim().split(/\s+/)
      if (processMessage.length < 5) {
        return
      }
      emulatorLists.value[processMessage[5]].pid = processMessage[0]
    })
  })
  console.log(emulatorLists.value)
}

function stopEmulator(name: string) {
  if (emulatorLists.value[name].pid === 0) {
    toast.error(t('emulator_not_running'))
    return
  }
  exec(`kill ${emulatorLists.value[name].pid}`, (err:any, stdout:any, stderr:any) => {
    if (err) {
      console.error(`停止进程失败: ${err.message}`);
      return;
    }
    console.log(`进程已成功停止: ${emulatorLists.value[name].pid}`);
  });
}

function startEmulator(name: string) {
  emulatorLists.value[name].logs = emulatorLists.value[name].logs.concat("------------------\n")
  // 命令行提示: https://developer.android.com/studio/run/emulator-commandline?hl=zh-cn
  const childProcess = exec(`${emulatorPath} -avd ${name}`, (err: any) => {
    if (err) {
      emulatorLists.value[name].logs = emulatorLists.value[name].logs.concat(err.message)
      if (err.message.includes('same AVD')) {
        toast.error(t('emulatorAlreadyRunning'))
        return
      }
      toast.error(`${t('emulatorStartFailed')}: ${err}`)
      return;
    }
  });
  emulatorLists.value[name].pid = childProcess.pid

  childProcess.stdout.on('data', (data: any) => {
    const logs = emulatorLists.value[name].logs || '';
    emulatorLists.value[name].logs = logs.concat(data.toString())
  });
  childProcess.on('exit', () => {
    console.log(emulatorLists.value[name].logs);
  });
}

emulatorListApp()
getEmulatorRunners()
</script>
<style>
.box {
  width: 330px;
  height: 210px;
  margin: 1%;
  padding: 1%;
  border: 1px solid #e4eaef;
  border-radius: 3%;
  text-align: center;
  box-shadow: 2px 5px 20px -3px #2c8af82e;
  background-color: #fff;
}

.table {
  border-radius: 10px;
  padding: 1% 0;
  text-align: center;
  height: 82vh;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 内容居中 */
.info, .bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1%;
}

/* info 和 bottom 布局 */
.info {
  width: 75%;
  height: 100%;
  float: left;
  margin-left: 1%;
  border: 1px solid #e4eaef;
  border-radius: 5%;
}

.botton {
  width: 23%;
  height: 100%;
  float: right;
  align-items: center; /* 将子元素垂直居中对齐 */
  vertical-align: middle;
  justify-content: center;
}

.botton > div {
  height: 20%;
  padding: 13.3% 0;
  margin: 33.3% 0;
  text-align: center;
  border: 1px solid #e4eaef;
  border-radius: 10%;
}

.botton > div:hover {
  cursor: pointer; /* 鼠标经过按钮时鼠标指针形状变成手型 */
  border: #FF6900 1px solid;
}

.botton > div:active {
  background: #57befc;
  color: #fff;
  border-color: #57befc;
  box-shadow: 0 2px 5px #57befc80
}

</style>
<template>
  <div class="page-container">
    <div class="page">
      <div class="flex flex-col">
        <header class="header"><h1 class="md:text-xl">{{ t("virtualMachine") }}</h1>
          <div class="flex flex-auto items-center justify-end">
            <div class="checkbox text-shadow-primary text-primary-600 cursor-pointer text-sm"><i
                class="clash-iconfont icon-check checkbox-icon" type="check" size="18"
                style="font-size: 18px;"></i>
              <div>自动刷新</div>
            </div>
          </div>
        </header>
        <div class="card my-2.5 p-0 md:my-4">
          <div style="clear: both;"></div>
          <ul class="table">
            <li class="box" v-for="key in Object.keys(emulatorLists)" :key="key" :value="emulatorLists[key]">
              <div class="info">
                {{ key }}
              </div>
              <div class="botton">
                <div @click="getEmulatorLogs(key)">日志</div>
                <div @click="startEmulator(key)">启动</div>
                <div @click="stopEmulator(key)">配置</div>
              </div>
            </li>
            <!--              <div class="proxy-group">-->
            <!--                <div class="md:h-15 mt-4 flex h-10 w-full items-center justify-between md:mt-0 md:w-auto">-->
            <!--                  <span-->
            <!--                      class="w-35 md:w-30 h-6 overflow-hidden overflow-ellipsis whitespace-nowrap px-5">开发</span><span-->
            <!--                    class="tag mr-5 md:mr-0">Selector</span></div>-->
            <!--                <div class="flex-1 py-2 md:py-4">-->
            <!--                  <div class="flex items-start overflow-y-hidden ml-5 md:ml-8"-->
            <!--                       style="height: 30px;">-->
            <!--                    <ul class="tags">-->
            <!--                      &lt;!&ndash;                                                <li class="tags-selected cursor-pointer">🎯 全球直连</li>&ndash;&gt;-->
            <!--                      <li class="cursor-pointer">开发1</li>-->
            <!--                      <li class="cursor-pointer error">开发2</li>-->
            <!--                      <li class="cursor-pointer">开发3</li>-->
            <!--                    </ul>-->
            <!--                    <span class="h-7 cursor-pointer select-none px-5 leading-7">展开</span>-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            <li>-->
            <!--              <div class="proxy-group">-->
            <!--                <div class="md:h-15 mt-4 flex h-10 w-full items-center justify-between md:mt-0 md:w-auto">-->
            <!--                  <span-->
            <!--                      class="w-35 md:w-30 h-6 overflow-hidden overflow-ellipsis whitespace-nowrap px-5">测试</span><span-->
            <!--                    class="tag mr-5 md:mr-0">Selector</span></div>-->
            <!--                <div class="flex-1 py-2 md:py-4">-->
            <!--                  <div class="flex items-start overflow-y-hidden ml-5 md:ml-8"-->
            <!--                       style="height: 30px;">-->
            <!--                    <ul class="tags">-->
            <!--                      <li class="tags-selected cursor-pointer">测试1</li>-->
            <!--                      <li class="cursor-pointer error">测试2</li>-->
            <!--                      <li class="tags-selected cursor-pointer">测试3</li>-->
            <!--                    </ul>-->
            <!--                    <span class="h-7 cursor-pointer select-none px-5 leading-7">展开</span>-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </li>-->
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.header {
  display: flex;
  margin: 10px 0;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.header > h1 {
  color: #2c8af8;
  text-shadow: 0 2px 6px rgba(44, 138, 248, .4);
  font-weight: 500;
  font-size: 24px;
  line-height: 32px;
  flex-shrink: 0;
}

.card {
  padding: 15px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 2px 5px 20px -3px #2c8af82e;
}

.tags {
  display: flex;
  box-sizing: content-box;
  list-style: none;
  flex: 1;
  align-items: center;
  flex-wrap: wrap;
}

.tags li {
  position: relative;
  display: flex;
  margin: 3px 4px;
  padding: 0 6px;
  height: 22px;
  border: 1px solid #2c8af8;
  border-radius: 11px;
  color: #54759a;
  font-size: 10px;
  align-items: center;
  justify-content: center;
}

.tags li.error {
  border-color: #f56c6c;
  background-color: #f56c6c;
  color: #fff;
}

.tags li.tags-selected.error {
  padding: 0 7px;
  height: 24px;
  border: none;
  background: linear-gradient(135deg, #2c8af8, #f56c6c);
}

.tags .tags-selected {
  background-color: #2c8af8;
  color: #fff;
}

.checkbox {
  position: relative;
  display: flex;
  padding-left: 26px;
  line-height: 18px;
  cursor: pointer;
}

.checkbox:before {
  position: absolute;
  top: 50%;
  left: 0;
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 1px solid #e4eaef;
  border-radius: 3px;
  background-color: #fff;
  content: "";
  transition: background-color .3s ease;
  transform: translateY(-9px);
}

.checkbox-icon {
  position: absolute;
  top: 50%;
  left: 0;
  text-shadow: none;
  font-weight: 700;
  line-height: 18px;
  transform: translateY(-9px) scale(.6);
}

.checkbox-icon.checkbox-icon {
  color: #fff;
}

.tag {
  display: flex;
  padding: 0 12px;
  height: 24px;
  border: 2px solid #2c8af8;
  border-radius: 12px;
  background-color: #fff;
  color: #2c8af8;
  text-align: center;
  font-size: 12px;
  align-items: center;
  justify-content: center;
}

@keyframes spinner {
  0% {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.proxy-group {
  display: flex;
  color: #546b87;
  font-size: 14px;
  align-items: flex-start;
}

@media (max-width: 768px) {
  .proxy-group {
    flex-direction: column;
  }
}

.page-container {
  overflow-y: scroll;
  padding-left: 10px;
  width: 100%;
  height: 100vh;
}

.page {
  display: flex;
  margin: 0 auto;
  padding: 20px 35px 30px 20px;
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
}

.clash-iconfont {
  color: #2c8af8;
  font-style: normal;
  font-size: 14px;
  font-family: "Yuanti TC", system-ui !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-check:before {
  content: "\e606";
}

h1 {
  margin: 0;
  font-weight: inherit;
  font-size: inherit;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}

.divide-gray-300 > :not([hidden]) ~ :not([hidden]) {
  border-color: rgba(209, 213, 219, var(--tw-divide-opacity));
  --tw-divide-opacity: 1;
}

.cursor-pointer {
  cursor: pointer;
}

.flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}

.flex-col {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
}

.items-start {
  -webkit-box-align: start;
  -ms-flex-align: start;
  -webkit-align-items: flex-start;
  align-items: flex-start;
}

.items-center {
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.justify-end {
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
}

.justify-between {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
}

.flex-auto {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;
}

.flex-1 {
  -webkit-box-flex: 1;
  -ms-flex: 110%;
  -webkit-flex: 110%;
  flex: 110%;
}

.h-7 {
  height: 1.75rem;
}

.h-10 {
  height: 2.5rem;
}

.h-6 {
  height: 1.5rem;
}

.text-sm {
  font-size: .875rem;
  line-height: 1.25rem;
}

.leading-7 {
  line-height: 1.75rem;
}

.list-none {
  list-style-type: none;
}

.mt-4 {
  margin-top: 1rem;
}

.mr-5 {
  margin-right: 1.25rem;
}

.ml-5 {
  margin-left: 1.25rem;
}

.overflow-hidden {
  overflow: hidden;
}

.overflow-y-hidden {
  overflow-y: hidden;
}

.p-0 {
  padding: 0;
}

.px-5 {
  padding-right: 1.25rem;
  padding-left: 1.25rem;
}

.py-2 {
  padding-top: .5rem;
  padding-bottom: .5rem;
}

.text-primary-600 {
  color: rgba(44, 138, 248, var(--tw-text-opacity));
  --tw-text-opacity: 1;
}

.overflow-ellipsis {
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}

.text-shadow-primary {
  text-shadow: 0 0 6px rgb(44 138 248 / 40%);
}

.select-none {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.whitespace-nowrap {
  white-space: nowrap;
}

.w-full {
  width: 100%;
}

.w-35 {
  width: 8.75rem;
}
</style>