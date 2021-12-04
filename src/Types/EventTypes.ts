export enum AppEventNames {
  /** AUTOUPDATER */
  AUTOUPDATER = 'AUTOUPDATER',
  /** openDirectory 选择文件夹目录 */
  OPENDIRECTORY = 'OPENDIRECTORY',
  /** 处理波形图 */
  WAVE_ACTION = 'WAVE_ACTION',
  // 音频预处理刷新列表
  REFRESH_UPLOAD_LIST = 'REFRESH_UPLOAD_LIST',
  // 获取波形图实例属性
  GET_WAVE_ATTR = 'GET_WAVE_ATTR',
  // 音频预处理删除上传文件同步删除图形
  REMOVE_AUDIO = 'REMOVE_AUDIO',
  // 音频预处理导出标记
  EXPORT_MARK = 'EXPORT_MARK'
}
