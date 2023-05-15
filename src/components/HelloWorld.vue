<script setup lang="ts">
import {ref} from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
    <div class="page-container">
        <div class="page">
            <div class="flex flex-col">
                <header class="header"><h1 class="md:text-xl">虚拟机</h1>
                    <div class="flex flex-auto items-center justify-end">
                        <div class="checkbox text-shadow-primary text-primary-600 cursor-pointer text-sm"><i
                                class="clash-iconfont icon-check checkbox-icon" type="check" size="18"
                                style="font-size: 18px;"></i>
                            <div>自动刷新</div>
                        </div>
                    </div>
                </header>
                <div class="card my-2.5 p-0 md:my-4">
                    <ul class="list-none divide-y divide-gray-300">
                        <li>
                            <div class="proxy-group">
                                <div class="md:h-15 mt-4 flex h-10 w-full items-center justify-between md:mt-0 md:w-auto">
                                    <span class="w-35 md:w-30 h-6 overflow-hidden overflow-ellipsis whitespace-nowrap px-5">开发</span><span
                                        class="tag mr-5 md:mr-0">Selector</span></div>
                                <div class="flex-1 py-2 md:py-4">
                                    <div class="flex items-start overflow-y-hidden ml-5 md:ml-8"
                                         style="height: 30px;">
                                        <ul class="tags">
                                            <!--                                                <li class="tags-selected cursor-pointer">🎯 全球直连</li>-->
                                            <li class="cursor-pointer">开发1</li>
                                            <li class="cursor-pointer error">开发2</li>
                                            <li class="cursor-pointer">开发3</li>
                                        </ul>
                                        <span class="h-7 cursor-pointer select-none px-5 leading-7">展开</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="proxy-group">
                                <div class="md:h-15 mt-4 flex h-10 w-full items-center justify-between md:mt-0 md:w-auto">
                                    <span class="w-35 md:w-30 h-6 overflow-hidden overflow-ellipsis whitespace-nowrap px-5">测试</span><span
                                        class="tag mr-5 md:mr-0">Selector</span></div>
                                <div class="flex-1 py-2 md:py-4">
                                    <div class="flex items-start overflow-y-hidden ml-5 md:ml-8"
                                         style="height: 30px;">
                                        <ul class="tags">
                                            <li class="tags-selected cursor-pointer">测试1</li>
                                            <li class="cursor-pointer error">测试2</li>
                                            <li class="tags-selected cursor-pointer">测试3</li>
                                        </ul>
                                        <span class="h-7 cursor-pointer select-none px-5 leading-7">展开</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
