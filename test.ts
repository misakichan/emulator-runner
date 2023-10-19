import {xml2json} from "xml-js";
import {exec} from "child_process";
import * as fs from "fs";
import * as https from 'https';
import {startup} from "vite-plugin-electron";
import exit = startup.exit;
import {string} from "yaml/dist/schema/common/string";
import {json} from "stream/consumers";

const tmp_dir = 'tmp';
if (!fs.existsSync(tmp_dir)) {
    console.log(fs.mkdirSync(tmp_dir, {recursive: true}));
    console.log('Directory created successfully.');
} else {
    console.log('Directory already exists.');
}

// let logs = "";
// let doing = false;
//
// // makdir tmp
//
//
// const childProcess = exec(`cat addons_list-5.xml | grep url | awk -F'>' '{print $2}' | awk -F'<' '{print $1}'`);
// childProcess.stdout?.on('data', (data: any) => {
//     logs = logs.concat(data.toString());
// });
// childProcess.on('exit', (code: any) => {
//     doing = true;
// });
// childProcess.on('error', (err: any) => {
//     console.log(err);
//     doing = true;
// });
//
// (async () => {
//     while (!doing) {
//         await new Promise(resolve => setTimeout(resolve, 1000)); // 延时1秒
//     }
//     console.log(logs);
//     // 在这里执行后续代码
// })();


const google_main_site = 'https://dl.google.com/android/repository/'
let main_xml_json;
let main_xml_status = false;
let system_image_play_store_json;
let system_image_default_xml_url = '';
let system_image_default_xml_json = {};
let system_image_default_xml_status = false;
let system_image_google_apis_xml_url = '';
let system_image_google_apis_xml_json = {};
let system_image_google_apis_xml_status = false;
let system_image_google_apis_playstore_xml_url = '';
let system_image_google_apis_playstore_xml_json = {};
let system_image_google_apis_playstore_xml_status = false;
let getDefaultSystemImageURLStatus = false;
let getGoogleApisSystemImageURLStatus = false;
let getGoogleApisPlayStoreSystemImageURLStatus = false;
let configJsons = JSON.parse(fs.readFileSync('config.json', 'utf8')) || {};
if (!configJsons["system-images"]) {
    configJsons["system-images"] = {
        "22": {
            default: {
                'x86_64': {},
                'arm64-v8a': {},
            },
            google_apis: {
                'x86_64': {},
                'arm64-v8a': {},
            },
            google_apis_playstore: {
                'x86_64': {},
                'arm64-v8a': {},
            }
        },
        "25": {
            default: {
                'x86_64': {},
                'arm64-v8a': {},
            },
            google_apis: {
                'x86_64': {},
                'arm64-v8a': {},
            },
            google_apis_playstore: {
                'x86_64': {},
                'arm64-v8a': {},
            }
        },
        "28": {
            default: {
                'x86_64': {},
                'arm64-v8a': {},
            },
            google_apis: {
                'x86_64': {},
                'arm64-v8a': {},
            },
            google_apis_playstore: {
                'x86_64': {},
                'arm64-v8a': {},
            }
        },
        "33": {
            default: {
                'x86_64': {},
                'arm64-v8a': {},
            },
            google_apis: {
                'x86_64': {},
                'arm64-v8a': {},
            },
            google_apis_playstore: {
                'x86_64': {},
                'arm64-v8a': {},
            }
        },
    }
}


function sendHttpRequest(url, function_name, callback) {
    console.log(`${function_name} doing`)
    https.get(google_main_site + url, response => {
        if (response.statusCode !== 200) {
            console.trace(`${function_name} statusCode: ${response.statusCode}`);
        }
        let responseBody = '';
        response.on('data', chunk => {
            responseBody += chunk;
        });

        response.on('end', () => {
            if (responseBody === '') {
                console.trace(`${function_name} responseBody: ${responseBody}`);
            }
            const tmp_json = xml2json(responseBody, {compact: true, spaces: 4});
            if (tmp_json === '{}') {
                console.trace(`${function_name} xml2json: ${tmp_json}`);
            }
            console.log(`${function_name} done`)
            callback(JSON.parse(tmp_json), true);
        });
    }).on('error', error => {
        console.trace(`${function_name} Error: ${error.message}`);
    })
}

function initMainXml() {
    sendHttpRequest('addons_list-5.xml', 'initMainXml', (modified_json: Object, modified_status: boolean) => {
        main_xml_json = modified_json;
        main_xml_status = modified_status;
    })
}

function getSystemImageXML() {
    (async () => {
        while (!main_xml_status) {
            await new Promise(resolve => setTimeout(resolve, 500)); // 延时1秒
        }
        console.log('getSystemImageXML doing')
        let sites = main_xml_json['common:site-list']['site'];
        if (sites.length === undefined || !sites) {
            console.trace(`getSystemImage sites: ${sites}`);
        }
        for (let i = 0; i < sites.length; i++) {
            let site_displayName = sites[i]['displayName']['_text'];
            if (site_displayName.includes('Android System Images')) {
                system_image_default_xml_url = sites[i]['url']['_text'];
            }
            if (site_displayName.includes('Google API add-on System Images')) {
                system_image_google_apis_xml_url = sites[i]['url']['_text'];
            }
            if (site_displayName.includes('Google API with Playstore System Images')) {
                system_image_google_apis_playstore_xml_url = sites[i]['url']['_text'];
            }
        }
        if (!system_image_default_xml_url || system_image_default_xml_url === "") {
            console.trace(`getSystemImage default url: ${system_image_default_xml_url}`);
        }
        if (!system_image_google_apis_xml_url || system_image_google_apis_xml_url === "") {
            console.trace(`getSystemImage google_apis url: ${system_image_google_apis_xml_url}`)
        }
        if (!system_image_google_apis_playstore_xml_url || system_image_google_apis_playstore_xml_url === "") {
            console.trace(`getSystemImage google_apis_playstore url: ${system_image_google_apis_playstore_xml_url}`)
        }
        sendHttpRequest(system_image_default_xml_url, 'getSystemImageXML default', (modified_json: Object, modified_status: boolean) => {
            system_image_default_xml_json = modified_json;
            system_image_default_xml_status = modified_status;
        })
        sendHttpRequest(system_image_google_apis_xml_url, 'getSystemImageXML google_apis', (modified_json: Object, modified_status: boolean) => {
            system_image_google_apis_xml_json = modified_json;
            system_image_google_apis_xml_status = modified_status;
        })
        sendHttpRequest(system_image_google_apis_playstore_xml_url, 'getSystemImageXML google_apis_playstore', (modified_json: Object, modified_status: boolean) => {
            system_image_google_apis_playstore_xml_json = modified_json;
            system_image_google_apis_playstore_xml_status = modified_status;
        })
    })();
}

function getSystemImageURL() {
    (async () => {
        while (!system_image_default_xml_status) {
            await new Promise(resolve => setTimeout(resolve, 500)); // 延时1秒
        }
        console.log('getSystemImage default doing')
        let sites = system_image_default_xml_json['sys-img:sdk-sys-img']['remotePackage']
        if (sites.length === undefined || !sites) {
            console.trace(`getSystemImageURL default sites: ${sites}`);
        }
        for (let i = 0; i < sites.length; i++) {
            let api_level = sites[i]['type-details']['api-level']['_text'];
            let abi = sites[i]['type-details']['abi']['_text'];

            if (abi !== 'x86_64' && abi !== 'arm64-v8a') {
                continue
            }
            if (sites[i]['type-details']['codename']) {
                continue
            }
            if (!configJsons["system-images"][api_level]) {
                continue
            }
            let os_args = sites[i]['archives']['archive'];
            configJsons["system-images"][api_level]['default'][abi]['path'] = (sites[i]['_attributes']['path'] ||= "异常路径").replaceAll(";", "/")
            if (os_args instanceof Array) {
                Object.values(os_args).forEach((value, index) => {
                    configJsons["system-images"][api_level]['default'][abi][value['host-os']['_text']] = google_main_site + "sys-img/android/" + value['complete']['url']['_text'];
                });
            } else if (os_args instanceof Object) {
                configJsons["system-images"][api_level]['default'][abi]["custom"] = google_main_site + "sys-img/default/" + os_args['complete']['url']['_text']
            } else {
                console.log(`getSystemImageURL default typeErr: ${os_args}`)
            }
        }
        getDefaultSystemImageURLStatus = true;
        console.log('getSystemImage default done')
    })();
    (async () => {
        while (!system_image_google_apis_xml_status) {
            await new Promise(resolve => setTimeout(resolve, 500)); // 延时1秒
        }
        console.log('getSystemImage google_apis doing')
        let sites = system_image_google_apis_xml_json['sys-img:sdk-sys-img']['remotePackage']
        if (sites.length === undefined || !sites) {
            console.trace(`getSystemImageURL google_apis sites: ${sites}`);
        }
        for (let i = 0; i < sites.length; i++) {
            let api_level = sites[i]['type-details']['api-level']['_text'];
            let abi = sites[i]['type-details']['abi']['_text'];
            if (abi !== 'x86_64' && abi !== 'arm64-v8a') {
                continue
            }
            if (sites[i]['type-details']['codename']) {
                continue
            }
            if (!configJsons["system-images"][api_level]) {
                continue
            }
            let os_args = sites[i]['archives']['archive'];
            configJsons["system-images"][api_level]['google_apis'][abi]['path'] = (sites[i]['_attributes']['path'] ||= "异常路径").replaceAll(";", "/")
            if (os_args instanceof Array) {
                Object.values(os_args).forEach((value, index) => {
                    configJsons["system-images"][api_level]['google_apis'][abi][value['host-os']['_text']] = google_main_site + "sys-img/google_apis/" + value['complete']['url']['_text'];
                });
            } else if (os_args instanceof Object) {
                configJsons["system-images"][api_level]['google_apis'][abi]["custom"] = google_main_site + "sys-img/google_apis/" + os_args['complete']['url']['_text']
            } else {
                console.log(`getSystemImageURL google_apis typeErr: ${os_args}`)
            }
        }
        getGoogleApisSystemImageURLStatus = true;
        console.log('getSystemImage google_apis done')
    })();
    (async () => {
        while (!system_image_google_apis_playstore_xml_status) {
            await new Promise(resolve => setTimeout(resolve, 500)); // 延时1秒
        }
        console.log('getSystemImage google_apis_playstore doing')
        let sites = system_image_google_apis_playstore_xml_json['sys-img:sdk-sys-img']['remotePackage']
        if (sites.length === undefined || !sites) {
            console.trace(`getSystemImageURL google_apis_playstore sites: ${sites}`);
        }
        for (let i = 0; i < sites.length; i++) {
            let api_level = sites[i]['type-details']['api-level']['_text'];
            let abi = sites[i]['type-details']['abi']['_text'];
            if (abi !== 'x86_64' && abi !== 'arm64-v8a') {
                continue
            }
            if (sites[i]['type-details']['codename']) {
                console.log(sites[i]['type-details']['codename'])
                continue
            }

            if (!configJsons["system-images"][api_level]) {
                continue
            }
            let os_args = sites[i]['archives']['archive'];
            configJsons["system-images"][api_level]['google_apis_playstore'][abi]['path'] = (sites[i]['_attributes']['path'] ||= "异常路径").replaceAll(";", "/")
            if (os_args instanceof Array) {
                Object.values(os_args).forEach((value, index) => {
                    console.log(1, os_args['complete']['url']['_text'])
                    configJsons["system-images"][api_level]['google_apis_playstore'][abi][value['host-os']['_text']] = google_main_site + "sys-img/google_apis_playstore/" + value['complete']['url']['_text'];
                });
            } else if (os_args instanceof Object) {
                console.log(2, os_args['complete']['url']['_text'])
                configJsons["system-images"][api_level]['google_apis_playstore'][abi]["custom"] = google_main_site + "sys-img/google_apis_playstore/" + os_args['complete']['url']['_text']
            } else {
                console.log(`getSystemImageURL google_apis_playstore typeErr: ${os_args}`)
            }
            getGoogleApisPlayStoreSystemImageURLStatus = true;
        }
        console.log('getSystemImage google_apis_playstore done')
    })();
}

function writeConfig() {
    (async () => {
            while (!getDefaultSystemImageURLStatus && !getGoogleApisSystemImageURLStatus && !getGoogleApisPlayStoreSystemImageURLStatus) {
                await new Promise(resolve => setTimeout(resolve, 500)); // 延时1秒
            }
            console.log('writeConfig doing')
            fs.writeFileSync('config.json', JSON.stringify(configJsons), 'utf8')
            console.log('writeConfig done')
        }
    )();
}


initMainXml()
getSystemImageXML()
getSystemImageURL()
writeConfig()
