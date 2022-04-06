/**
 * @持久化配置 【默认配置】
 */

import { SettingTypes } from '@/Types/SettingTypes';
import _WorkPath from '@/Main/Global/_WorkPath';

const defaultExportPath = _WorkPath('download');
const defaultSavePath = _WorkPath('voiceFiles');
const DefaultLocalSetting: SettingTypes = {
  devTools: false,
  clickTotal: 0,
  hotUpdater: false,
  serverAddr: 'http://localhost:5002',
  exportPath: defaultExportPath,
  savePath: defaultSavePath
};

export default DefaultLocalSetting;
