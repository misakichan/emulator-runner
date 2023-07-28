<script setup lang="ts">

import {getConfig} from "../cli/config";
import {ref} from "vue";
import path from "path";

const {exec} = require('child_process');

const config = ref(getConfig())
const emulatorsLog = ref({} as { [key: string]: any });


function test1() {

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