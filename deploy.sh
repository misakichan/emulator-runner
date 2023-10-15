#!/usr/bin/env bash

rm -rf dist

./start.sh "Android 5" "Android 5" "src/img/Android.png"
./start.sh "Android 7" "Android 7" "src/img/Android.png"
./start.sh "Android 12" "Android 12" "src/img/Android.png"
./start.sh "Android 5" "三国志·战略版" "src/img/sgz.png"
./start.sh "Android 5" "金铲铲之战" "src/img/jcc.png"
./start.sh "Android 12" "穿越火线 枪战王者" "src/img/cfm.png"

cd dist
create-dmg \
  --volname "Android 5" \
  --volicon "Android 5.icns" \
  --background "../src/img/banner.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "Android 5.app" 200 190 \
  --hide-extension "Android 5.app" \
  --app-drop-link 600 185 \
  "Android 5.dmg" \
  "Android 5.app"
create-dmg \
  --volname "Android 7" \
  --volicon "Android 7.icns" \
  --background "../src/img/banner.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "Android 7.app" 200 190 \
  --hide-extension "Android 7.app" \
  --app-drop-link 600 185 \
  "Android 7.dmg" \
  "Android 7.app"
create-dmg \
  --volname "Android 12" \
  --volicon "Android 12.icns" \
  --background "../src/img/banner.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "Android 12.app" 200 190 \
  --hide-extension "Android 12.app" \
  --app-drop-link 600 185 \
  "Android 12.dmg" \
  "Android 12.app"
create-dmg \
  --volname "三国志·战略版" \
  --volicon "三国志·战略版.icns" \
  --background "../src/img/banner.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "三国志·战略版.app" 200 190 \
  --hide-extension "三国志·战略版.app" \
  --app-drop-link 600 185 \
  "三国志·战略版.dmg" \
  "三国志·战略版.app"
create-dmg \
  --volname "金铲铲之战" \
  --volicon "金铲铲之战.icns" \
  --background "../src/img/banner.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "金铲铲之战.app" 200 190 \
  --hide-extension "金铲铲之战.app" \
  --app-drop-link 600 185 \
  "金铲铲之战.dmg" \
  "金铲铲之战.app"
create-dmg \
  --volname "穿越火线 枪战王者" \
  --volicon "穿越火线 枪战王者.icns" \
  --background "../src/img/banner.png" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "穿越火线 枪战王者" 200 190 \
  --hide-extension "穿越火线 枪战王者.app" \
  --app-drop-link 600 185 \
  "穿越火线 枪战王者.dmg" \
  "穿越火线 枪战王者.app"

if [ "${GITHUB_WORKSPACE}" != "" ] && [ "${GITHUB_WORKSPACE}" != "" ]; then
  echo "GitHub Action Build"
  mv "穿越火线 枪战王者.dmg" cfm.dmg
  mv "金铲铲之战.dmg" jcc.dmg
  mv "三国志·战略版.dmg" sgz.dmg
fi
