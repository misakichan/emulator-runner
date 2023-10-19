<script setup lang="ts">
import path from "path";
import {t} from '../cli/i18n'
import {getConfig} from "../cli/config";
import {useToast} from "vue-toastification";
import {ref, WatchStopHandle, watch} from 'vue'
import {accessSync, readdirSync, readFileSync, lstatSync, promises, readdir, stat, statSync, constants} from "fs";
import {exec} from "child_process";
import {router} from "../cli/router";

const toast = useToast()

let stopWatch: WatchStopHandle
const config = ref(getConfig())
const logViewRaw = ref("")
const logViewName = ref("")
const emulatorLists = ref({} as { [key: string]: any });
const emulatorPath = path.join(process.env.sdkPath ?? "异常路径", 'emulator/emulator')
defineProps<{ msg: string }>()
console.log(config.value)

function logViewClose() {
  logViewName.value = '';
  logViewRaw.value = ''
  stopWatch()
}


async function findAvdFiles(dir: string, depth: number, callback: (filePath: string) => void,): Promise<void> {
  if (depth > 8) {
    return;
  }

  const files = await promises.readdir(dir);

  for (const file of files) {
    if (file.endsWith('.avd')) {
      callback(path.join(dir, file));
    }
  }

  for (const file of files) {
    if (file === '.DS_Store') {
      continue;
    }

    const filePath = path.join(dir, file);

    if (depth > 3 && !filePath.includes('.app')) {
      continue;
    }

    if (file === 'Contents') {
      depth = 5;
    }

    const fileStat = await promises.stat(filePath);

    if (fileStat.isDirectory()) {
      try {
        const linkStat = await promises.lstat(filePath);
        if (linkStat.isSymbolicLink()) {
          continue;
        }
      } catch (error) {
        continue; // 如果 lstat 报错，说明文件不存在或者无权限访问，直接跳过
      }

      await findAvdFiles(filePath, depth + 1, callback);
    }
  }
}

function emulatorListApp() {
  let logs = ""
  let timeLast = new Date();
  const childProcess = exec(`find /Applications -name "*.avd" -type d -mindepth 5 -maxdepth 8`)
  childProcess.stdout?.on('data', (data: any) => {
    logs = logs.concat(data.toString());
  });
  childProcess.on('exit', () => {
    logs.split('\n').filter((line: any) => {
      // let name = line.trim().split(/\n/)
      if (line === "") {
        return
      }
      // EXAMPLE /Applications/金铲铲之战.app/Contents/MacOS/avd/Android5_1610.avd
      let avdID = line.split('/').pop().replace('.avd', '')
      let display_name = avdID
      line.split('/').filter((item: any) => {
        if (item === "") {
          return
        }
        if (item.includes('.app')) {
          display_name = item.replace('.app', '')
          return
        }
      })
      let avdIcon = path.join(line, '../../../Resources/ApplicationStub.png')
      let execAPP = path.join(line, '../../../MacOS/runemu')
      try {
        accessSync(avdIcon, constants.F_OK);
        avdIcon = "file://" + avdIcon
      } catch (err) {
        avdIcon = "/src/static/icon.png";
      }

      if (emulatorLists.value[avdID] === undefined) {
        emulatorLists.value[avdID] = {
          avd: avdID,
          name: display_name,
          icon: avdIcon,
          config: path.join(line, 'config.ini'),
          execAPP: execAPP,
          pid: 0,
          logs: ''
        }
      } else {
        emulatorLists.value[avdID].avd ||= avdID
        emulatorLists.value[avdID].name ||= display_name
        emulatorLists.value[avdID].icon ||= avdIcon
        emulatorLists.value[avdID].config ||= path.join(line, 'config.ini')
        emulatorLists.value[avdID].pid ||= 0
        emulatorLists.value[avdID].logs ||= ''
        emulatorLists.value[avdID].execAPP ||= execAPP
      }
    })
    console.debug(emulatorLists.value)
    if (Object.keys(emulatorLists.value).length === 0) {
      toast.info(t('noEmulator'))
      return
    }
    console.log("childProcess 耗时: " + (new Date().getTime() - timeLast.getTime()) + "ms");
  });

  timeLast = new Date();
  let fileLists: string[] = []
  findAvdFiles('/Applications', 0, (filePath) => {
    fileLists.push(filePath);
  }).then(() => {
    console.log("findAvdFiles 耗时: " + (new Date().getTime() - timeLast.getTime()) + "ms");
    console.log('findAvdFiles:', fileLists)
  });

  readdir(`${process.env.HOME}/.android/avd`, (err, files) => {
    if (err) {
      console.error('无法读取目录:', err);
      return;
    }
    files.forEach((file) => {
      if (!file.includes('.avd')) {
        return
      }
      stat(`${process.env.HOME}/.android/avd/${file}`, (err, stats) => {
        if (err) {
          console.error(`无法读取文件 ${file}:`, err);
          return;
        }
        if (stats.isDirectory()) {
          let avdID = file.replace('.avd', '')
          let display_name = avdID
          let avdIcon = "/icon.png"
          let configPath = path.join(`${process.env.HOME}/.android/avd/${file}`, 'config.ini')
          readFileSync(configPath, 'utf8').split('\n').filter((line: any) => {
            if (line === "") {
              return
            }
            if (line.includes('avd.ini.displayname')) {
              display_name = line.replace('avd.ini.displayname=', '')
              return;
            }
            // if (line.includes(process.env.HOME)) {
            //   line.replace(process.env.HOME, '')
            //   return
            // } TODO 更新路径
          })
          if (emulatorLists.value[avdID] === undefined) {
            emulatorLists.value[avdID] = {
              avd: avdID,
              name: display_name,
              icon: avdIcon,
              config: configPath,
              execAPP: emulatorPath,
              pid: 0,
              logs: ''
            }
          } else {
            emulatorLists.value[avdID].avd ||= avdID
            emulatorLists.value[avdID].name ||= display_name
            emulatorLists.value[avdID].icon ||= avdIcon
            emulatorLists.value[avdID].config ||= configPath
            emulatorLists.value[avdID].pid ||= 0
            emulatorLists.value[avdID].logs ||= ''
            emulatorLists.value[avdID].execAPP ||= emulatorPath
          }
        }
      });
    });
  })
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
      console.log(line)
      const matchResult = line.match(/-avd\s+([\w\d_]+)/);
      const avdName = matchResult && matchResult[1];
      let done = false
      Object.values(emulatorLists).forEach((item: any) => {
        if (item.avd === avdName) {
          item.pid = processMessage[0]
          done = true
        }
      })
      if (!done) {
        emulatorLists.value[avdName] ||= {pid: processMessage[0], avd: avdName,}
      }
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
  const childProcess = exec(`bash ${emulatorLists.value[name].execAPP}`, (err: any) => {
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

  childProcess.stdout?.on('data', (data: any) => {
    const logs = emulatorLists.value[name].logs || '';
    emulatorLists.value[name].logs = logs.concat(data.toString())
  });
  childProcess.on('exit', () => {
    emulatorLists.value[name].pid = 0
  });
}

function configEmulator(name: string) {
  // open /emulateconfig
  router.push('/config')
  console.log(name)
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
                <img :src=emulatorLists[key].icon alt="Icon">
                <h5 style="width: 80%">{{ emulatorLists[key].name }}</h5>
              </div>
              <div class="button">
                <div @click="getEmulatorLogs(key)">日志</div>
                <div class="running" v-show="emulatorLists[key].pid!=0" @click="stopEmulator(key)">停止</div>
                <div class="stopped" v-show="emulatorLists[key].pid==0" @click="startEmulator(key)">启动</div>
                <div @click="configEmulator(key)">配置</div>
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
  height: 87vh;
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
  width: 280px;
  height: 230px;
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
  flex-direction: column;
  margin-right: 7%;
  width: 70%;
  height: 100%;
  float: left;
  border: 1px solid #e4eaef;
  border-radius: 5%;
}

.info > img {
  width: 90%;
}

.info > h5 {
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 1.5rem;
  color: #e87109;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info > h5:hover {
  cursor: pointer; /* 鼠标经过按钮时鼠标指针形状变成手型 */
  white-space: nowrap;
  overflow: visible;
  text-overflow: clip;
}

.button {
  width: 23%;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}

.button > div {
  height: 18%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 42% 0; /* TODO 这里数据有一点偏差 */
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
  padding: 20px 35px 0px 20px;
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