import { message } from 'antd';

export enum ResponseErrorDesc {
  UNMARSHAL_ERROR = '数据解析失败',
  PARAMETER_ERROR = '请求参数错误',
  DATABASE_ERROR = '数据库操作失败',
  ALGO_ERROR = '算法错误',
  INTERNAL_ERROR = '查询结果不存在',
  STAT_FILE_ERROR = '获取文件信息失败',
  PARSE_VOICE_ERROR = '解析音频信息失败',
  AUDIO_WAVE_FORM_ERROR = '获取波形失败',
  FILE_FORMAT_ERROR = '文件异常'
}

/** 上传音频轮询失败提示信息 */
export enum UploadErrorDesc {
  UPLOAD_XXXX = '音频复制失败',
  UPLOAD_XXXXS = '音频转换失败',
  UPLOAD_XXXXX = '音频解析失败'
}

/** 处理错误提示 */
export const errorMessage = (error: Error, msg?: string) => {
  const network = (error?.message?.toString() || '').indexOf('Network Error');
  message.error(`${error.name}：${network > -1 ? '网络错误' : msg || error?.message}`);
  console.log(`错误处理:`, network, error);
};
