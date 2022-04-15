// 相关格式: '.wav,.mp3,.aac,.ac3,.ape,.flac,.aiff,.m4a,.mp2,.wma,.amr,.silk,.slk,.flv,.mov,.m4v,.avi,.mkv,.mp4,.mpg,.swf,.vob,.wmv';

/** 支持上传的格式 (上传选择) */
export const AudioSuffix: string[] = [
  'wav',
  'mp3',
  'avi',
  'silk',
  'mpg',
  'm4a',
  'aac',
  'ac3',
  'aiff',
  'amr',
  'ape',
  'aud',
  'flac',
  'mp2',
  'pcm',
  'slk',
  'adu',
  'wma',
  'avi',
  'flv',
  'm4v',
  'mkv',
  'mov',
  'mp4',
  'asf',
  '3gp',
  'mpg',
  'swf',
  'vob',
  'wmv'
];

/** 支持直接上传的格式 */
export const AudioSupport: string[] = ['wav'];

/** 可以播放的格式 */
export const AudioPlayed: string[] = ['wav', 'mp3', 'aac', 'flac', 'm4a'];

/** 后端可以生成波形图的格式:(.mp3, .wav, .flac, .ogg, .oga, .dat) */

/**
 * 音频格式转换
 * @param 支持格式 wav
 * @param 支持声道 单声道 (1)
 * @param 支持采样率 16k
 */
export const formatMatch = <T extends { format: string; channel: string; real_channel: number; sampleRate: string; sampleFmt: string }>(voiceInfo: T) => {
  const res =
    AudioSupport.includes(voiceInfo.format?.toLocaleLowerCase()) &&
    voiceInfo.real_channel === 1 &&
    voiceInfo.sampleRate === '16000' &&
    voiceInfo.sampleFmt === 's16';
  return !res;
};
