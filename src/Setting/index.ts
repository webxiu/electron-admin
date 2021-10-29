/**
 * @持久化配置 【默认配置】
 */

import { SettingTypes } from '@/Types/SettingTypes';

const DefaultLocalSetting: SettingTypes = {
  devTools: false,
  clickTotal: 0,
  hotUpdater: false,
  serverAddr: 'http://localhost:5002'
};

export default DefaultLocalSetting;
