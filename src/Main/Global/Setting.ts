/**
 * 配置书写规则
 * @SettingInfo 1、一维，扁平
 */

import DefaultLocalSetting from '@/Setting';
import _WorkPath from './_WorkPath';
import fs from 'fs';
import path from 'path';

const PackageJson = require('../../../package.json');

const SettingGet = () => {
  const settingFilePath = _WorkPath('setting.json', true);
  if (settingFilePath && fs.existsSync(settingFilePath)) {
    try {
      const inner = fs.readFileSync(settingFilePath, { encoding: 'utf8' });
      return JSON.parse(inner);
    } catch (error) {
      return DefaultLocalSetting;
    }
  }
  return DefaultLocalSetting;
};
const SettingSet = (settingInner = {}) => {
  $$.log.info(`【Action】 update settings`);
  const settingFilePath = _WorkPath('setting.json', true);
  settingInner = Object.assign(SettingGet(), settingInner);
  /** 缺失字段，设置上默认值 */
  for (const item of Reflect.ownKeys(DefaultLocalSetting)) {
    if (Reflect.toString.call(settingInner[item]) === '[object Undefined]') {
      settingInner[item] = DefaultLocalSetting[item];
    }
  }
  /** 多余字段，删除 */
  for (const item of Reflect.ownKeys(settingInner)) {
    if (Reflect.toString.call(DefaultLocalSetting[item]) === '[object Undefined]') {
      Reflect.deleteProperty(settingInner, item);
    }
  }

  if (settingFilePath && fs.existsSync(settingFilePath)) {
    try {
      fs.writeFileSync(settingFilePath, JSON.stringify(settingInner, null, 2), { encoding: 'utf8' });
      return true;
    } catch (error) {
      console.error('更新配置文件失败，请检查');
      return false;
    }
  }
  fs.writeFileSync(settingFilePath, JSON.stringify(DefaultLocalSetting, null, 2), { encoding: 'utf8' });
  return true;
};

/** 初始化 setting.json */
SettingSet();

/** 图谱 存储音频文件 */
const setWaveFile = (fileName: string, buffer: Buffer) => {
  const tempLocalPath = _WorkPath('tempDownloadFiles');
  const voicePath = path.join(tempLocalPath, fileName);

  if (tempLocalPath && fs.existsSync(tempLocalPath)) {
    try {
      fs.writeFileSync(voicePath, buffer, { encoding: 'utf8' });
      return voicePath;
    } catch (error) {
      console.error('音频保存失败');
      return '';
    }
  }
  return '';
};

/** 图谱 获取音频文件 */
const getWaveFile = (fileName) => {
  const tempLocalPath = _WorkPath('tempDownloadFiles');
  const voicePath = path.join(tempLocalPath, fileName);
  if (tempLocalPath && fs.existsSync(tempLocalPath)) {
    try {
      const inner = fs.readFileSync(voicePath, { encoding: 'utf8' });
      if (inner) {
        return voicePath;
      }
    } catch (error) {
      return '';
    }
  }
  return '';
};

/** 挂载到全局 */
Reflect.set($$, 'Settings', {
  read: SettingGet,
  write: SettingSet
});

/** 图谱 音频存储 */
Reflect.set($$, 'waveVoice', {
  write: setWaveFile,
  read: getWaveFile
});

const __PackageJson = JSON.parse(JSON.stringify(PackageJson));
const appName = __PackageJson.build.productName;
const language = __PackageJson.build.nsis.installerLanguages;

Reflect.set($$, 'appName', appName);
Reflect.set($$, 'language', language); //'zh-CN' 'en-US'
