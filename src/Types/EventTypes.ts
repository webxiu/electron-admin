export enum AppEventNames {
  /** 窗口关闭事件 */
  WINDOW_CLOSE = 'WINDOW_CLOSE',
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
  EXPORT_MARK = 'EXPORT_MARK',
  // 设置重新加载图谱(折叠侧边栏)
  RELOAD_WAVE = 'RELOAD_WAVE',
  // 图谱控制->视频播放器
  CONTROL_VIDEO = 'CONTROL_VIDEO',
  // 视频播放器控制->图谱
  CONTROL_WAVE = 'CONTROL_WAVE',
  // 监听音频是否被编辑
  WAVE_IS_EDIT = 'WAVE_IS_EDIT'
}
