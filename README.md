## 安装

> 直接下载DMG安装包 双击打开即可 第一次比较慢

## 修改配置

配置文件路径: `三国志·战略版.app/Contents/MacOS/avd/Android5_1598.avd/config.ini`

```ini
disk.dataPartition.size 用户数据（磁盘空间）大小
hw.cpu.ncore 分配的CPU核心数
hw.lcd.density 虚拟显示DPI
hw.lcd.height 虚拟显示尺寸高度
hw.lcd.width 虚拟显示尺寸宽度
hw.ramSize RAM（运行内存）限制（最低2GB）
```

## 修改语言

> 首次启动默认为英文，打开Settings（设置）- System（Languages, gestures, time, backup）- Languages & input（Gboard）- Languages（English (United States)）- Add a language - 简体中文 中国 - 将简体中文（中国）拖动到1位置即可。

## 恢复出厂设置/修改硬盘大小

硬盘目录: `三国志·战略版.app/Contents/MacOS/avd/Android5_1598.avd/`

> 重新配置用户数据（磁盘空间）大小时，您还需要删除该目录中的所有文件, config.ini 除外。

---

## 自定义

### 克隆项目

下载 https://github.com/XRSec/emulator-runner/archive/refs/heads/dev.zip

解压 压缩包 重命名为 `emulator-runner`

### 新建模拟器

```bash
cd ~/Downloads/emulator-runner
bash start.sh
```

## Bugs

1. 已知 AVD Name 不能包含空格 中文, 所以固定名称
2. 我不会自定义固件, 所以没办法默认设置 中文, 安装各种软件包,money 你懂的

## TODO

- [x] 添加 全面屏 Skins 
- [ ] 精简镜像
- [ ] 按键映射 库

## REQ

1. [Android Studio](https://developer.android.com/studio)
2. [Android SDK](https://developer.android.com/studio/releases/platform-tools)
3. [Android Emulator](https://developer.android.com/studio/run/emulator)
4. [Android Emulator Command-line](https://developer.android.com/studio/run/emulator-commandline)
5. [Start the emulator from the command line](https://developer.android.com/studio/run/emulator-commandline)
6. [Android Emulator Config](https://developer.android.com/studio/run/emulator-commandline#startup-options)
7. [XML Config](https://dl.google.com/android/repository/addons_list-5.xml)


### Inter

```log
Preparing "Install SDK Patch Applier v4 v.1".
Downloading https://dl.google.com/android/repository/3534162-studio.sdk-patcher.zip
"Install SDK Patch Applier v4 v.1" ready.
Installing SDK Patch Applier v4 in /Users/mac/Library/Android/sdk/patcher/v4
"Install SDK Patch Applier v4 v.1" complete.
"Install SDK Patch Applier v4 v.1" finished.
Preparing "Install Sources for Android 34 (revision 1)".
Downloading https://dl.google.com/android/repository/sources-34_r01.zip
"Install Sources for Android 34 (revision 1)" ready.
Installing Sources for Android 34 in /Users/mac/Library/Android/sdk/sources/android-34
"Install Sources for Android 34 (revision 1)" complete.
"Install Sources for Android 34 (revision 1)" finished.
Preparing "Install Android SDK Platform 34 (revision 2)".
Downloading https://dl.google.com/android/repository/platform-34-ext7_r02.zip
"Install Android SDK Platform 34 (revision 2)" ready.
Installing Android SDK Platform 34 in /Users/mac/Library/Android/sdk/platforms/android-34
"Install Android SDK Platform 34 (revision 2)" complete.
"Install Android SDK Platform 34 (revision 2)" finished.
Preparing "Install Android SDK Build-Tools 34 v.34.0.0".
Downloading https://dl.google.com/android/repository/build-tools_r34-macosx.zip
"Install Android SDK Build-Tools 34 v.34.0.0" ready.
Installing Android SDK Build-Tools 34 in /Users/mac/Library/Android/sdk/build-tools/34.0.0
"Install Android SDK Build-Tools 34 v.34.0.0" complete.
"Install Android SDK Build-Tools 34 v.34.0.0" finished.
Preparing "Install Android SDK Platform-Tools v.34.0.4".
Downloading https://dl.google.com/android/repository/platform-tools_r34.0.4-darwin.zip
"Install Android SDK Platform-Tools v.34.0.4" ready.
Installing Android SDK Platform-Tools in /Users/mac/Library/Android/sdk/platform-tools
"Install Android SDK Platform-Tools v.34.0.4" complete.
"Install Android SDK Platform-Tools v.34.0.4" finished.
Preparing "Install Android Emulator v.32.1.15".
Downloading https://dl.google.com/android/repository/emulator-darwin_x64-10696886.zip

Packages to install: - Intel x86 Atom System Image (system-images;android-22;default;x86)


Preparing "Install Intel x86 Atom System Image API 22 (revision 6)".
Downloading https://dl.google.com/android/repository/sys-img/android/x86-22_r06.zip
```

```log
Last login: Mon Oct 16 20:46:09 on ttys000
/Users/mac/Documents/Android\ 5.app/Contents/MacOS/runemu ; exit;
➜  ~ /Users/mac/Documents/Android\ 5.app/Contents/MacOS/runemu ; exit;





















  [~]  正在初始化资源文件 ...
  [✓]  初始化完成!
INFO    | Android emulator version 32.1.15.0 (build_id 10696886) (CL:N/A)
INFO    | Found systemPath /Users/mac/Library/Android/sdk//system-images/android-32/default/x86_64
INFO    | Storing crashdata in: /tmp/android-mac/emu-crash.db, detection is enabled
INFO    | Duplicate loglines will be removed, if you wish to see each indiviudal line launch with the -log-nofilter flag.
WARNING | Please update the emulator to one that supports the feature(s): Vulkan
INFO    | Sending adb public key [QAAAAHediqi5s5YceKNZBvPlQ9hBOOr/+Pg6mV3BKihTt3FW97JWpqDEKknOwZq31qtp2CPvSy+ve73lPuaRUvbEI7Y4wMOnT8bpRFbTSxJIjb/zIJhKE2TNqLz8Qgx61gJ7rff1nbB/JB9pwtcf1EWwiIWqmxynA5Mj/lM4zE57bGcyXRRyEUROHYAY3mqtIKi12UMZaEcR9/B1JnDpzXSz+vvzhkxF+wMAgkZ/dfZqbWEZ7JhcFwiE8vG5ESlY7GKsBPRItv0usPnoCOf8jg4WZkjiDZlp3dfSa7BVKQjsY5qVDJtRflh0ZS8IC9j0XqPh16oMMm+yoGbqbRekmSy5uDFDY0C8wJf85iPkyRxuBEZRwcapStvsUd64Z1XhK+Z81ecXDkfnqM0/0Rfrm5HiPy054vNeD6yLEGGaN17mzXpMZzwjbDCmHJBzZ04HRXv/KFAqemeGOJalhA34zgTIZLEvCep4FzvzaLfSS+iyEXsRsziuluzMTAU/YNMfsPdNKTtf51+0ybFiwiZtqwzh1oGyJYHtKknRaDVK816M3ga8I0IjsjX4m88HnwVmVL4W7OIamj/0wzl2USRLIIzTArMOvXzJq5dONZVte6cAyjbg7vEh2be9J+0OxM8BQWU95ullppevKX4/a+rAp4Cail7+FNOsZWlSuPnUXD7LJUCUmi5FcQEAAQA= mac@unknown]
WARNING | cannot add library /Users/mac/Library/Android/sdk/emulator/qemu/darwin-x86_64/lib64/vulkan/libvulkan.dylib: failed
WARNING | VirtioWifi is only support on API level 30 and above.
INFO    | added library /Users/mac/Library/Android/sdk/emulator/lib64/vulkan/libvulkan.dylib
pc_memory_init: above 4g size: 40000000
WARNING | *** No gRPC protection active, consider launching with the -grpc-use-jwt flag.***
INFO    | Started GRPC server at 127.0.0.1:8554, security: Local, auth: none
INFO    | Advertising in: /Users/mac/Library/Caches/TemporaryItems/avd/running/pid_6145.ini
Could not initialize record - Unknown Audiodevice
Could not initialize record - Unknown Audiodevice
Failed to create voice `adc'
INFO    | Setting display: 0 configuration to: 1440x3040, dpi: 560x560 
WARNING | Failed to process .ini file /Users/mac/.android/emu-update-last-check.ini for reading.
ERROR   | Unable to connect to adb daemon on port: 5037
INFO    | Your emulator is out of date, please update by launching Android Studio:
 - Start Android Studio
 - Select menu "Tools > Android > SDK Manager"
 - Click "SDK Tools" tab
 - Check "Android Emulator" checkbox
 - Click "OK"
WARNING | Failed to process .ini file /Users/mac/.android/emu-update-last-check.ini for reading.
```


https://dl.google.com/android/repository/sys-img/google_apis/x86_64-32_r07.zip
https://dl.google.com/android/repository/sys-img/android/x86_64-32_r01.zip