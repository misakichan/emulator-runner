## Emulator Runner

Android Studio Virtual Device Emulator Runner

**Testting**

## 调试须知
1. Applications 文件夹下必须要有 类似 `Android Studio.app` 文件夹
2. `Android Studio.app` 文件夹可以从 release 下载

## TODO

- [ ] 需要 正确 设置 `electron/main/index.ts staticPath` 路径: 打包后 和 没打包 的路径
- [ ] 需要将 dev 分支 的 `src/Android.app` 复制到 `src/static` 目录
- [ ] `icon.png` 正确打包了, 但是只有 浏览器 能访问, 我不能直接复制, 所以 我该怎么获取 `Android.app` 示例呢?
- [ ] nodejs 读取 配置文件, 默认为 `emulatorLists.value[avdID].config`
- [ ] 顺便解决下 `console` 提示的几个问题