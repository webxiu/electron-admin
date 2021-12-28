import { Button, Popover, Select, Spin, message } from 'antd';
import React, { Component, createRef } from 'react';
import { inject, observer } from 'mobx-react';

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { toJS } from 'mobx';
import utils from '@/Render/utils';
import waveUtil from './waveUtil';

ffmpeg.setFfmpegPath(path.join($$.rootPath, 'ffmpeg/ffmpeg.exe'));
/** ffmpeg 所在目录 */
const sdPath = path.join($$.rootPath, 'ffmpeg');

type TProps = {
  className?: string;
  onZoomChange?: (zoom: number) => void;
};

type TState = {
  playing: boolean;
};

const noop = () => {};
const cacheWaveId = {};

@inject('Global')
@observer
class Wave extends Component<TProps, TState> {
  state = {
    playing: false
  };

  constructor(props) {
    super(props);
    this.handleResize = utils.debounce(this.resize);
  }
  componentDidMount() {}
  componentWillUnmount() {}
  componentDidUpdate(prevProps: TProps, prevState: TState) {}

  handleResize: () => void;
  resize = () => {};

  // 字符串转为ArrayBuffer对象，参数为字符串
  str2ab(str: string) {
    const buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  /** 获取文件流存本地 */
  getFilePath = ({ fileId, name, sampleRate, channel }) => {
    const res = this.str2ab('快放假啦积分');
    return new Promise((resolve, reject) => {
      const int8 = new Uint8Array(res, 2);
      const voicePath: string = $$.waveVoice.write(name, waveUtil.getWavBuffer(int8, sampleRate, channel));
      const outFilePath = path.join(Reflect.get($$, 'tempWaveFile'), `${Date.now()}.wav`);
      const inputFilePath = `G:\\tools\\测试音频\\音频_不同格式文件\\8k.wav`;

      let sOut = 's16le';
      if (sampleRate === 8000) {
        sOut = 's32le';
      } else if (sampleRate === 16000) {
        sOut = 's16le';
      }
      const sdPath = path.join($$.rootPath, 'ffmpeg');
      const cp = spawn(
        path.join(sdPath, 'ffmpeg.exe'),
        ['-f', `${sOut}`, '-ar', `${sampleRate}`, '-ab', '16k', '-ac', '2', '-v', '16', '-y', '-i', inputFilePath, `${outFilePath}`],
        { cwd: sdPath }
      );

      cp.on('data', (data) => {
        resolve(voicePath);
        console.log(`data======================>`, data);
      });

      cp.on('end', (data) => {});
      cp.on('error', (code) => {
        reject(code);
      });
      cp.on('exit', (code) => {
        console.log(`exit`, code);
      });
    });
  };

  render() {
    return (
      <div>
        <span>xxxxxxxxxxxxxxxxxxxxxxx</span>
      </div>
    );
  }
}

export default Wave;
