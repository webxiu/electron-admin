import React, { Component, createRef } from 'react';

import { Button } from 'antd';
import SvgIcon from '@/Render/components/SvgIcon';

const { desktopCapturer } = require('electron');
export default class MediaRecord extends Component {
  // videoRef = createRef<HTMLVideoElement>();
  // currentWebData = null;
  // recorder: MediaRecorder;

  componentDidMount() {}

  async startRecord() {
    // const stream = await navigator.mediaDevices.getDisplayMedia();
    // if (!this.videoRef?.current) return;
    // this.videoRef.current.srcObject = stream;
    // this.recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=h264' });
    // this.recorder.ondataavailable = this.onDataavailable;
  }

  // async stopRecord() {
  //   if (!this.videoRef.current) return;
  // }
  async onDataavailable() {}

  render() {
    return (
      <div className="box">
        ====555
        <SvgIcon iconName="message" fill="#00f" style={{ color: '#0f0' }} />
        <SvgIcon iconName="notfound" />
        <SvgIcon iconName="http://localhost:8006/images/notfound.svg" />
        {/* <video width={200} height={200} autoPlay controls ref={this.videoRef}></video>
        <div>
          <Button type="primary" onClick={this.startRecord}>
            录制
          </Button>
          <Button type="primary" onClick={this.stopRecord}>
            停止
          </Button>
        </div>
        <style jsx global>{``}</style> */}
      </div>
    );
  }
}
