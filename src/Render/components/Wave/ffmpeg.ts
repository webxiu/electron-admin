import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import waveUtil from './waveUtil';

// import ffmpeg from 'fluent-ffmpeg';
// ffmpeg.setFfmpegPath(path.join($$.rootPath, 'ffmpeg/ffmpeg.exe'));
/** ffmpeg 所在目录 */
const sdPath = path.join($$.rootPath, 'ffmpeg');

export const sampleObj = {
  8000: 's8le',
  16000: 's16le',
  32000: 's32le'
};

/** 音频操作 */
export const execFfmpeg = (spawnCmd: string[]) => {
  return new Promise((resolve, reject) => {
    const cp = spawn(path.join(sdPath, 'ffmpeg.exe'), spawnCmd, { cwd: sdPath });

    cp.on('data', (data) => {
      console.log(`data======================>`, data);
    });
    cp.on('end', (data) => {
      reject('end');
      console.log('data', data);
    });
    cp.on('error', (code) => {
      reject(code);
      console.log('code', code);
    });
    cp.on('exit', (code) => {
      reject(code);
      console.log(`exit`, code);
    });
  });
};

export type SaveVoiceType = { name: string; int8: Buffer | Uint8Array; sampleRate: number; channels: number };
/** 音频保存 */
export const saveFfmpeg = (config: SaveVoiceType) => {
  let { name, int8, sampleRate, channels } = config;
  const buffer = waveUtil.getWavBuffer(int8, sampleRate, channels);
  const inputPath: string = $$.waveVoice.write(name, buffer);
  const outPath = path.join(Reflect.get($$, 'tempWaveFile'), `${Date.now()}.wav`);
  return { inputPath, outPath };
};
