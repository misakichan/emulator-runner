<script setup lang="ts">

import {ipcRenderer} from "electron";
import {t} from "../cli/i18n";
import {openConfig, getConfig, saveConfig, reload} from "../cli/config";
import {ref} from "vue";
import path from "path";

const {exec} = require('child_process');

const config = ref(getConfig())

function test1() {
  console.log(config.value.sdkPath);
  exec(`${path.join(config.value.sdkPath, 'tools', 'bin', 'avdmanager')} -s list target`, (err, stdout, stderr) => {
    if (err) {
      console.error(`执行shell命令出错: ${err}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}

</script>

<template>
  <br>
  <br>
  <br>
  <br>
  <br>
  <bottom @click="test1">你好</bottom>
</template>

<style scoped>

</style>