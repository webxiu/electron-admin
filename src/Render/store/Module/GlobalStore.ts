import { action, observable, runInAction } from 'mobx';

interface UserInfoType {
  username: string;
  password: string;
}

export default class {
  @observable public version: string;
  @observable public userInfo: UserInfoType;

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
}
