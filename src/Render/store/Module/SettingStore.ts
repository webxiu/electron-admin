import { action, observable, runInAction, toJS } from 'mobx';

import { SettingTypes } from '@/Types/SettingTypes';
import axios from '@/Render/axios';

export default class {
  @observable settings: SettingTypes;

  constructor() {
    this.settings = JSON.parse(JSON.stringify(toJS($$.Settings.read())));
    axios.defaults.baseURL = this.settings.serverAddr;
  }

  @action public SetSettings = async (newSetting: Partial<SettingTypes>) => {
    runInAction(() => {
      this.settings = Object.assign(toJS(this.settings), newSetting);
      $$.Settings.write(newSetting);
    });
  };
}
