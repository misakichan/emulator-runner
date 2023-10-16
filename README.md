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
