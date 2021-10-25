import { AppEventNames } from '~/src/Types/EventTypes';
import { dialog } from 'electron';

/** openDirectory 选择文件夹目录 */
$$.Event.on(AppEventNames.OPENDIRECTORY, (callback: Function) => {
  const DirectoryList: string[] | undefined = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
  callback && callback(DirectoryList);
});
