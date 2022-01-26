import { action, observable, runInAction } from 'mobx';

interface UserInfoType {
  username: string;
  password: string;
}

export type TWaveData = {
  orignFileId?: number;
  orignWaveId?: number;
  originBufMs?: number;
  orignCutBuf?: Uint8Array | Buffer;
};

export default class {
  @observable public version: string;
  @observable public userInfo: UserInfoType;
  // 波形图操作数据暂存
  @observable public waveCacheData: TWaveData = {};
  @observable public region = { begin_time: 0, end_time: 0 };
  @observable public totalMs = 0;

  public constructor() {
    this.version = process.versions.electron;
    this.userInfo = {
      username: '',
      password: ''
    };
  }

  @action public UpdateUserInfo = async (UserInfo: UserInfoType) => {
    runInAction(() => {
      this.userInfo = UserInfo;
    });
  };
  // 设置波形图操作过程数据
  @action setCacheWaveData = (waveBuf: TWaveData) => {
    this.waveCacheData = waveBuf;
  };
  @action setRegion = (params) => {
    this.region = params;
  };
  @action setTotalMs = (params) => {
    this.totalMs = params;
  };
}
