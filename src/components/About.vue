<script setup lang="ts">

import {ipcRenderer} from "electron";
import {t} from "../cli/i18n";

function test1() {
  console.log(t('dashboard'));
}

</script>

<template>
  <bottom @click="test1"></bottom>
</template>

<style scoped>

</style>