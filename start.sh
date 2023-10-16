#!/usr/bin/env bash

# set color
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
COL_NC='\033[0m' # No Color
COL_LIGHT_YELLOW='\033[1;33m'
INFO="[${COL_LIGHT_YELLOW}~${COL_NC}]"
OVER="\r\033[K"
printf "\033[H\033[2J" # 清理屏幕
# set msg
msg_info() {
    printf "  ${INFO}  %s ${COL_LIGHT_YELLOW}...${COL_NC}" "${1}" 1>&2
}

msg_over() {
    printf "${OVER}%s" "" 1>&2
}
msg_last() {
    for ((i = 1; i <= ${1}; i++)); do
        printf "\r\033[1A%s" "" 1>&2
        printf "\r\033[K%s" "" 1>&2
    done
}

msg_ok() {
    printf "${OVER}  [\033[1;32m✓${COL_NC}]  %s\n" "${1}" 1>&2
    msg_over
}

msg_err() {
    printf "${OVER}  [\033[1;31m✗${COL_NC}]  %s\n" "${1}" 1>&2
    exit 1
}

makeIcns() {
    mkdir icons.iconset/
    sips -z 16 16 "${appIcons}" --out icons.iconset/icon_16x16.png >/dev/null 2>&1
    sips -z 32 32 "${appIcons}" --out icons.iconset/icon_16x16@2x.png >/dev/null 2>&1
    sips -z 32 32 "${appIcons}" --out icons.iconset/icon_32x32.png >/dev/null 2>&1
    sips -z 64 64 "${appIcons}" --out icons.iconset/icon_32x32@2x.png >/dev/null 2>&1
    sips -z 64 64 "${appIcons}" --out icons.iconset/icon_64x64.png >/dev/null 2>&1
    sips -z 128 128 "${appIcons}" --out icons.iconset/icon_64x64@2x.png >/dev/null 2>&1
    sips -z 128 128 "${appIcons}" --out icons.iconset/icon_128x128.png >/dev/null 2>&1
    sips -z 256 256 "${appIcons}" --out icons.iconset/icon_128x128@2x.png >/dev/null 2>&1
    sips -z 256 256 "${appIcons}" --out icons.iconset/icon_256x256.png >/dev/null 2>&1
    sips -z 512 512 "${appIcons}" --out icons.iconset/icon_256x256@2x.png >/dev/null 2>&1
    sips -z 512 512 "${appIcons}" --out icons.iconset/icon_512x512.png >/dev/null 2>&1
    sips -z 1024 1024 "${appIcons}" --out icons.iconset/icon_512x512@2x.png >/dev/null 2>&1
    iconutil -c icns icons.iconset -o "dist/${appName}.icns"
    cp "${appIcons}" "dist/${appName}.png"
    rm -rf icons.iconset
}

repo=https://dl.google.com/android/repository/


msg_info 正在初始化资源文件
echo
find "${PWD}" -name ".DS_Store" -exec rm -v "{}" \;
if [ -e "dist" ]; then rm -rf dist; fi
ANDROID_SDK_ROOT="${HOME}/Library/Android/sdk/"
if [ ! -d "${ANDROID_SDK_ROOT}" ]; then mkdir -p "${ANDROID_SDK_ROOT}"; fi
if [ ! -d "tmp" ]; then mkdir tmp; fi
if [ ! -d "dist" ]; then mkdir dist; fi
if [ ! -d "${ANDROID_SDK_ROOT}/emulator" ]; then
      emulator_url=https://dl.google.com/android/repository/emulator-darwin_aarch64-10696886.zip
    if [ "$(arch)" != "arm64" ]; then
      emulator_url=https://dl.google.com/android/repository/emulator-darwin_x64-10696886.zip
    fi
    if [ ! -e "tmp/emulator.zip" ]; then curl -s "${emulator_url}" -o tmp/emulator.zip; fi
    unzip -q "tmp/emulator.zip" -d "${ANDROID_SDK_ROOT}"

fi
if [ ! -d "${ANDROID_SDK_ROOT}/platform-tools" ]; then
    if [ ! -e "tmp/platform-tools.zip" ]; then curl -s https://dl.google.com/android/repository/platform-tools_r34.0.4-darwin.zip -o tmp/platform-tools.zip; fi
    unzip -q "tmp/platform-tools.zip" -d "${ANDROID_SDK_ROOT}"
fi
#if [ ! -d "${ANDROID_SDK_ROOT}/skins" ]; then
#    cp -r src/Android.app/Contents/MacOS/skins "${ANDROID_SDK_ROOT}/" # TODO
#else
#    if [ ! -d "${ANDROID_SDK_ROOT}/skins/pixel_4_xl" ]; then
#        cp -r src/Android.app/Contents/MacOS/skins/pixel_4_xl "${ANDROID_SDK_ROOT}/skins/" # TODO
#    fi
#fi
if [ ! -d "${ANDROID_SDK_ROOT}/platforms" ]; then
    mkdir "${ANDROID_SDK_ROOT}/platforms"
fi

if [ -z "$1" ]; then
    echo "    请选择创建的系统版本"
    options=("Android 5" "Android 5 Google" "Android 7" "Android 7 Google" "Android 12" "Android 12 Google" "Quit")
    select opt in "${options[@]}"; do
        msg_last 5
    done
else
    opt=$1
fi

case $opt in
"Android 5")
    system_images=Android5
    system_images_url="https://dl.google.com/android/repository/sys-img/android/arm64-v8a-22_r02.zip"
    system_images_path="system-images/android-22/default"
    ;;
"Android 5 Google")
    system_images=Android5_google
    system_images_url="https://dl.google.com/android/repository/sys-img/google_apis/arm64-v8a-22_r26.zip"
    system_images_path="system-images/android-22/google_apis"
    ;;
"Android 7")
    system_images=Android7
    system_images_url="https://dl.google.com/android/repository/sys-img/android/arm64-v8a-25_r02.zip"
    system_images_path="system-images/android-25/default"
    ;;
"Android 7 Google")
    system_images=Android7_google
    system_images_url="https://dl.google.com/android/repository/sys-img/google_apis/arm64-v8a-25_r20.zip"
    system_images_path="system-images/android-25/google_apis"
    ;;
"Android 12")
    system_images=Android12
    system_images_url="https://dl.google.com/android/repository/sys-img/android/arm64-v8a-32_r01.zip"
    system_images_path="system-images/android-32/default"
    ;;
"Android 12 Google")
    system_images=Android12_google
    system_images_url="https://dl.google.com/android/repository/sys-img/google_apis/arm64-v8a-32_r06.zip"
    system_images_path="system-images/android-32/google_apis"
    ;;
"Quit")
    exit 0
    ;;
*)
    echo "Invalid option"
    exit 0
    ;;
esac

if [ ! -d "${ANDROID_SDK_ROOT}/${system_images_path}" ]; then
    if [ ! -e "tmp/${system_images}.zip" ]; then
        curl -s "${system_images_url}" -o "tmp/${system_images}.zip"
    fi
    mkdir -p "${ANDROID_SDK_ROOT}/${system_images_path}"
    unzip -q "tmp/${system_images}.zip" -d "${ANDROID_SDK_ROOT}/${system_images_path}"
fi

msg_ok 初始化完成!

msg_info 正在设置APP信息
echo

if [ -z "$2" ]; then
    read -p "    请设置APP名称 示例: 三国志 战略版 : " -r appName
    msg_last 1
else
    appName=$2
fi
msg_ok "APP名称: ${appName}"

if [ -z "$3" ]; then
    read -p "    请设置APP图标 将PNG图标文件拖动到这里, 然后回车; 没有的话就回车: " -r appIcons
    msg_last 1
else
    appIcons=$3
fi

app_id="$((RANDOM % 1000 + 1000))"

if [ ! -d "dist/${appName}.app" ]; then
    cp -r src/Android.app "dist/${appName}.app"
else
    rm -rf "dist/${appName}.app"
    cp -r "src/Android.app" "dist/${appName}.app"
fi

if [ -z "$appIcons" ]; then
    msg_ok "APP图标: 默认"
    if [ -e "dist/${appName}.icns" ]; then
        cp "dist/${appName}.icns" "dist/${appName}.app/Contents/Resources/ApplicationStub.icns"
    fi
    if [ -e "dist/${appName}.png" ]; then
        cp "dist/${appName}.png" "dist/${appName}.app/Contents/Resources/ApplicationStub.png"
    fi
else
    if [ ! -e "dist/${appName}.icns" ]; then
        appIcons="$(echo "${appIcons}" | sed "s/'//g")"
        msg_ok "APP图标: ${appIcons}"
        makeIcns
    else
        msg_ok "APP图标: dist/${appName}.icns"
    fi

    cp "dist/${appName}.icns" "dist/${appName}.app/Contents/Resources/ApplicationStub.icns"
    cp "dist/${appName}.png" "dist/${appName}.app/Contents/Resources/ApplicationStub.png"
fi

sed -i '' "s/=Android/=${appName}/g" "dist/${appName}.app/Contents/MacOS/avd/Android.avd/config.ini"
sed -i '' "s|image.sysdir.1=system_images_path|image.sysdir.1=${system_images_path}/arm64-v8a|g" "dist/${appName}.app/Contents/MacOS/avd/Android.avd/config.ini"
sed -i '' "s/Android/${system_images}_${app_id}/g" "dist/${appName}.app/Contents/MacOS/avd/Android.ini"
sed -i '' "s|-avd Android|-avd ${system_images}_${app_id}|g" "dist/${appName}.app/Contents/MacOS/runemu"
sed -i '' "s|system_images=system_images|system_images=${system_images}|g" "dist/${appName}.app/Contents/MacOS/runemu"
sed -i '' "s|system_images_url=system_images_url|system_images_url=\"${system_images_url}\"|g" "dist/${appName}.app/Contents/MacOS/runemu"
sed -i '' "s|system_images_path=system_images_path|system_images_path=\"${system_images_path}\"|g" "dist/${appName}.app/Contents/MacOS/runemu"
mv "dist/${appName}.app/Contents/MacOS/avd/Android.avd" "dist/${appName}.app/Contents/MacOS/avd/${system_images}_${app_id}.avd"
mv "dist/${appName}.app/Contents/MacOS/avd/Android.ini" "dist/${appName}.app/Contents/MacOS/avd/${system_images}_${app_id}.ini"

msg_ok APP信息加载完成
open dist
