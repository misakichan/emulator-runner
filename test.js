"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var xml_js_1 = require("xml-js");
var fs = require("fs");
var https = require("https");
var tmp_dir = 'tmp';
if (!fs.existsSync(tmp_dir)) {
    console.log(fs.mkdirSync(tmp_dir, { recursive: true }));
    console.log('Directory created successfully.');
}
else {
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
var google_main_site = 'https://dl.google.com/android/repository/';
var main_xml_json;
var main_xml_status = false;
var system_image_play_store_json;
var system_image_default_xml_url = '';
var system_image_default_xml_json = {};
var system_image_default_xml_status = false;
var system_image_google_apis_xml_url = '';
var system_image_google_apis_xml_json = {};
var system_image_google_apis_xml_status = false;
var system_image_google_apis_playstore_xml_url = '';
var system_image_google_apis_playstore_xml_json = {};
var system_image_google_apis_playstore_xml_status = false;
function sendHttpRequest(url, function_name, callback) {
    console.log("".concat(function_name, " doing"));
    https.get(google_main_site + url, function (response) {
        if (response.statusCode !== 200) {
            console.trace("".concat(function_name, " statusCode: ").concat(response.statusCode));
        }
        var responseBody = '';
        response.on('data', function (chunk) {
            responseBody += chunk;
        });
        response.on('end', function () {
            if (responseBody === '') {
                console.trace("".concat(function_name, " responseBody: ").concat(responseBody));
            }
            var tmp_json = (0, xml_js_1.xml2json)(responseBody, { compact: true, spaces: 4 });
            if (tmp_json === '{}') {
                console.trace("".concat(function_name, " xml2json: ").concat(tmp_json));
            }
            console.log("".concat(function_name, " done"));
            callback(JSON.parse(tmp_json), true);
        });
    }).on('error', function (error) {
        console.trace("".concat(function_name, " Error: ").concat(error.message));
    });
}
function initMainXml() {
    sendHttpRequest('addons_list-5.xml', 'initMainXml', function (modified_json, modified_status) {
        main_xml_json = modified_json;
        main_xml_status = modified_status;
    });
}
function getSystemImageXML() {
    var _this = this;
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var sites, i, site_displayName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!main_xml_status) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    _a.sent(); // 延时1秒
                    return [3 /*break*/, 0];
                case 2:
                    console.log('getSystemImageXML doing');
                    sites = main_xml_json['common:site-list']['site'];
                    if (sites.length === undefined || !sites) {
                        console.trace("getSystemImage sites: ".concat(sites));
                    }
                    for (i = 0; i < sites.length; i++) {
                        site_displayName = sites[i]['displayName']['_text'];
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
                        console.trace("getSystemImage default url: ".concat(system_image_default_xml_url));
                    }
                    if (!system_image_google_apis_xml_url || system_image_google_apis_xml_url === "") {
                        console.trace("getSystemImage google_apis url: ".concat(system_image_google_apis_xml_url));
                    }
                    if (!system_image_google_apis_playstore_xml_url || system_image_google_apis_playstore_xml_url === "") {
                        console.trace("getSystemImage google_apis_playstore url: ".concat(system_image_google_apis_playstore_xml_url));
                    }
                    sendHttpRequest(system_image_default_xml_url, 'getSystemImageXML default', function (modified_json, modified_status) {
                        system_image_default_xml_json = modified_json;
                        system_image_default_xml_status = modified_status;
                    });
                    console.log(system_image_google_apis_xml_url);
                    sendHttpRequest(system_image_google_apis_xml_url, 'getSystemImageXML google_apis', function (modified_json, modified_status) {
                        system_image_google_apis_xml_json = modified_json;
                        system_image_google_apis_xml_status = modified_status;
                    });
                    sendHttpRequest(system_image_google_apis_playstore_xml_url, 'getSystemImageXML google_apis_playstore', function (modified_json, modified_status) {
                        system_image_google_apis_playstore_xml_json = modified_json;
                        system_image_google_apis_playstore_xml_status = modified_status;
                    });
                    return [2 /*return*/];
            }
        });
    }); })();
}
function getSystemImageURL() {
    var _this = this;
    var tmp_jsons = {
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
    };
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var sites, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!system_image_default_xml_status) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    _a.sent(); // 延时1秒
                    return [3 /*break*/, 0];
                case 2:
                    console.log('getSystemImage default doing');
                    sites = system_image_default_xml_json['sys-img:sdk-sys-img']['remotePackage'];
                    if (sites.length === undefined || !sites) {
                        console.trace("getSystemImageURL default sites: ".concat(sites));
                    }
                    _loop_1 = function (i) {
                        var api_level = sites[i]['type-details']['api-level']['_text'];
                        var abi = sites[i]['type-details']['abi']['_text'];
                        if (abi !== 'x86_64' && abi !== 'arm64-v8a') {
                            return "continue";
                        }
                        if (sites[i]['type-details']['codename']) {
                            return "continue";
                        }
                        if (!tmp_jsons[api_level]) {
                            return "continue";
                        }
                        var os_args = sites[i]['archives']['archive'];
                        if (os_args instanceof Array) {
                            Object.values(os_args).forEach(function (value, index) {
                                tmp_jsons[api_level]['default'][abi][value['host-os']['_text']] = google_main_site + "sys-img/android/" + value['complete']['url']['_text'];
                            });
                        }
                        else if (os_args instanceof Object) {
                            tmp_jsons[api_level]['default'][abi]["custom"] = google_main_site + "sys-img/android/" + os_args['complete']['url']['_text'];
                        }
                        else {
                            console.log("getSystemImageURL default typeErr: ".concat(os_args));
                        }
                    };
                    for (i = 0; i < sites.length; i++) {
                        _loop_1(i);
                    }
                    return [2 /*return*/];
            }
        });
    }); })();
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var sites, _loop_2, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!system_image_google_apis_xml_status) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    _a.sent(); // 延时1秒
                    return [3 /*break*/, 0];
                case 2:
                    console.log('getSystemImage google_apis doing');
                    sites = system_image_google_apis_xml_json['sys-img:sdk-sys-img']['remotePackage'];
                    if (sites.length === undefined || !sites) {
                        console.trace("getSystemImageURL google_apis sites: ".concat(sites));
                    }
                    _loop_2 = function (i) {
                        var api_level = sites[i]['type-details']['api-level']['_text'];
                        var abi = sites[i]['type-details']['abi']['_text'];
                        if (abi !== 'x86_64' && abi !== 'arm64-v8a') {
                            return "continue";
                        }
                        if (sites[i]['type-details']['codename']) {
                            return "continue";
                        }
                        if (!tmp_jsons[api_level]) {
                            return "continue";
                        }
                        var os_args = sites[i]['archives']['archive'];
                        if (os_args instanceof Array) {
                            Object.values(os_args).forEach(function (value, index) {
                                tmp_jsons[api_level]['google_apis'][abi][value['host-os']['_text']] = google_main_site + "sys-img/google_apis/" + value['complete']['url']['_text'];
                            });
                        }
                        else if (os_args instanceof Object) {
                            tmp_jsons[api_level]['google_apis'][abi]["custom"] = google_main_site + "sys-img/google_apis/" + os_args['complete']['url']['_text'];
                        }
                        else {
                            console.log("getSystemImageURL google_apis typeErr: ".concat(os_args));
                        }
                    };
                    for (i = 0; i < sites.length; i++) {
                        _loop_2(i);
                    }
                    return [2 /*return*/];
            }
        });
    }); })();
    (function () { return __awaiter(_this, void 0, void 0, function () {
        var sites, _loop_3, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!system_image_google_apis_xml_status) return [3 /*break*/, 2];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 1:
                    _a.sent(); // 延时1秒
                    return [3 /*break*/, 0];
                case 2:
                    console.log('getSystemImage google_apis_playstore doing');
                    sites = system_image_google_apis_playstore_xml_json['sys-img:sdk-sys-img']['remotePackage'];
                    if (sites.length === undefined || !sites) {
                        console.trace("getSystemImageURL google_apis_playstore sites: ".concat(sites));
                    }
                    _loop_3 = function (i) {
                        var api_level = sites[i]['type-details']['api-level']['_text'];
                        var abi = sites[i]['type-details']['abi']['_text'];
                        if (api_level === '25') {
                            console.log(sites[i]['_attributes']['path']);
                        }
                        if (abi !== 'x86_64' && abi !== 'arm64-v8a') {
                            return "continue";
                        }
                        if (api_level === '25') {
                            console.log(sites[i]['_attributes']['path']);
                        }
                        if (sites[i]['type-details']['codename']) {
                            return "continue";
                        }
                        if (api_level === '25') {
                            console.log(sites[i]['_attributes']['path']);
                        }
                        if (!tmp_jsons[api_level]) {
                            return "continue";
                        }
                        if (api_level === '25') {
                            console.log(sites[i]['_attributes']['path']);
                        }
                        var os_args = sites[i]['archives']['archive'];
                        if (os_args instanceof Array) {
                            Object.values(os_args).forEach(function (value, index) {
                                tmp_jsons[api_level]['google_apis_playstore'][abi][value['host-os']['_text']] = google_main_site + "sys-img/google_apis_playstore/" + value['complete']['url']['_text'];
                            });
                        }
                        else if (os_args instanceof Object) {
                            tmp_jsons[api_level]['google_apis_playstore'][abi]["custom"] = google_main_site + "sys-img/google_apis_playstore/" + os_args['complete']['url']['_text'];
                        }
                        else {
                            console.log("getSystemImageURL google_apis_playstore typeErr: ".concat(os_args));
                        }
                    };
                    for (i = 0; i < sites.length; i++) {
                        _loop_3(i);
                    }
                    fs.writeFile('config.json', JSON.stringify(tmp_jsons), function (err) {
                    });
                    return [2 /*return*/];
            }
        });
    }); })();
}
initMainXml();
getSystemImageXML();
getSystemImageURL();
