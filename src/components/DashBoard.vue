<script setup lang="ts">
import path from "path";
import {t} from '../cli/i18n'
import {getConfig} from "../cli/config";
import {useToast} from "vue-toastification";
import {ref, WatchStopHandle, watch} from 'vue'

const toast = useToast()

let stopWatch: WatchStopHandle
const config = ref(getConfig())
const logViewRaw = ref("")
const logViewName = ref("")
const {exec} = require('child_process');
const emulatorLists = ref({} as { [key: string]: any });
const emulatorPath = path.join(config.value.sdkPath, 'emulator', 'emulator')

defineProps<{ msg: string }>()

function logViewClose() {
  logViewName.value = '';
  logViewRaw.value = ''
  stopWatch()
}

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
  if (logViewName.value !== '' || logViewRaw.value !== '') {
    logViewClose()
    return
  }
  if (!emulatorLists.value[name].logs) emulatorLists.value[name].logs = t("none")
  logViewName.value = name
  logViewRaw.value = emulatorLists.value[name].logs
  stopWatch = watch(() => emulatorLists.value[name].logs, () => {
    logViewRaw.value = emulatorLists.value[name].logs
  });
}

function getEmulatorRunners() {
  // 带有命令行的list进程命令是：“cmd.exe /c wmic process list full”
  //  tasklist 是没有带命令行参数的。可以把这两个命令再cmd里面执行一下看一下效果
  // 注意：命令行获取的都带有换行符，获取之后需要更换换行符。可以执行配合这个使用 str.replace(/[\r\n]/g,""); 去除回车换行符
  let cmd = process.platform === 'win32' ? 'tasklist' : 'ps -exa | grep -v grep | grep emulator | grep qemu'
  exec(cmd, function (err: any, stdout: any, stderr: any) {
    if (stdout === "") {
      toast.info(t('noRunningEmulator'))
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
}

function stopEmulator(name: string) {
  if (emulatorLists.value[name].pid === 0) {
    toast.error(t('emulator_not_running'))
    return
  }
  exec(`kill ${emulatorLists.value[name].pid}`, (err: any, stdout: any, stderr: any) => {
    if (err) {
      console.error(`停止进程失败: ${err.message}`);
      return;
    }
    console.log(`进程已成功停止: ${emulatorLists.value[name].pid}`);
  });
  getEmulatorRunners()
}

function startEmulator(name: string) {
  emulatorLists.value[name].logs = emulatorLists.value[name].logs.concat("\n------------------\n")
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
    emulatorLists.value[name].pid = 0
  });
}

emulatorListApp()
getEmulatorRunners()
</script>

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
            <li class="box" v-for="key in Object.keys(emulatorLists)" :key="key">
              <div class="info">
                {{ key }}
              </div>
              <div class="button">
                <div @click="getEmulatorLogs(key)">日志</div>
                <div class="running" v-show="emulatorLists[key].pid!=0" @click="stopEmulator(key)">停止</div>
                <div class="stopped" v-show="emulatorLists[key].pid==0" @click="startEmulator(key)">启动</div>
                <div @click="">配置</div>
              </div>
            </li>
          </ul>
          <div class="drawer" v-show="logViewName">
            <button @click="logViewClose" class="close-button">x</button>
            <h5>{{ logViewName }}</h5>
            <hr style="background: #FF6900;height: 1px;width: 94%;margin: 0 2%">
            <div>{{ logViewRaw }}</div>
          </div>
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

.running {
  background: #FF6900;
  color: #fff;
}

.stopped {
  background: #57befc;
  color: #fff;
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

@keyframes spinner {
  0% {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.flex > .card {
  display: flex;
}

.table {
  flex: 1;
  padding: 1% 0;
  height: 82vh;
  border-radius: 10px;
  display: flex;
  overflow-y: auto;
  flex-wrap: wrap;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  text-align: center;
  align-items: center;
  align-content: flex-start;
  justify-content: center;
}

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

.info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1%;
}

.info {
  width: 75%;
  height: 100%;
  float: left;
  margin-left: 1%;
  border: 1px solid #e4eaef;
  border-radius: 5%;
}

.button {
  width: 23%;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}

.button > div {
  height: 22.5%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 22.5% 0; /* TODO 这里数据有一点偏差 */
  text-align: center;
  border: 1px solid #e4eaef;
  border-radius: 10%;
}

.button > div:hover {
  cursor: pointer; /* 鼠标经过按钮时鼠标指针形状变成手型 */
  border: #FF6900 1px solid;
}

.item > a:hover {
  cursor: pointer; /* 鼠标经过按钮时鼠标指针形状变成手型 */
  border: #e4eaef 1px solid;
}

.button > div:active {
  background: #57befc;
  color: #fff;
  border-color: #57befc;
  box-shadow: 0 2px 5px #57befc80
}

.drawer {
  width: 45%;
  display: block;
  background: #e4eaef;
  border-radius: 10px;
  padding: 1% 0;
  height: 82vh;
  margin: 0.5%;
  position: relative;
  overflow-y: auto;
  text-align: center;
  align-items: center;
  justify-content: center;
  white-space: pre-wrap;
  align-content: flex-start;
}

.drawer > div {
  text-align: left;
  padding: 1% 1% 1% 2%;
  white-space: pre-wrap;
  word-wrap: break-word; /* 或者使用 overflow-wrap: break-word; */
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  color: transparent;
  background-color: red;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.close-button:hover {
  color: black;
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

.flex-auto {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;
}

.text-sm {
  font-size: .875rem;
  line-height: 1.25rem;
}

.p-0 {
  padding: 0;
}

.text-primary-600 {
  color: rgba(44, 138, 248, var(--tw-text-opacity));
  --tw-text-opacity: 1;
}

.text-shadow-primary {
  text-shadow: 0 0 6px rgb(44 138 248 / 40%);
}
</style>