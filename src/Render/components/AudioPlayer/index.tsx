// // import './index.scss';
// import 'antd/lib/slider/style/index.css';

// import { Button, Modal } from 'antd';
// import React, { Component } from 'react';

// import AudioPlayer from '@spk/audioplayer';
// import PubSub from 'pubsub-js';
// import axios from 'axios';

// interface Props {
//   voiceid?: string;
//   suspension?: boolean; // 悬浮
//   inBox?: boolean; // 是否在弹窗框里面显示
//   selectArea?: { start: number; end: number }[]; // 选中区域
// }

// interface State {
//   showAudio: boolean;
//   singleId: number;
// }

// let vid = 1;

// const defaultConfig = {
//   ...(AudioPlayer as any).defaultProps.config,
//   backend: 'MediaElement',
//   scrollParent: false,
//   backgroundColor: '#081b3a',
//   progressColor: '#942810',
//   cursorColor: '#942810',
//   waveColor: '#3EA4FF',
//   barWidth: 2,
//   hideScrollbar: true,
//   responsive: true,
//   useTimeline: true
// };

// class AudioPlayerComponent extends Component<Props> {
//   private wavesurfer: any = null;
//   private aduioRef: any = null;
//   private subToken: any = null;
//   state: State = {
//     showAudio: false,
//     singleId: 0
//   };
//   onClose = () => {
//     this.setState({
//       showAudio: false
//     });
//     this.wavesurfer?.unAll();
//     this.wavesurfer = null;
//   };
//   modalVisible = () => {
//     this.setState({
//       showAudio: true
//     });
//   };
//   componentWillUnmount() {
//     PubSub.unsubscribe(this.subToken);
//     this.wavesurfer?.unAll();
//     this.wavesurfer = null;
//     this.subToken = null;
//   }
//   componentDidMount() {
//     this.setState({
//       singleId: vid++
//     });
//     this.subToken = PubSub.subscribe('pause audio', (name: string, id: number) => {
//       if (id !== this.state.singleId) {
//         this.aduioRef?.setState({ playing: false });
//         this.wavesurfer?.pause();
//       }
//     });
//   }

//   downloadFiles = (fielId: string) => {
//     return axios({
//       url: `/v1/download?file_id=${fielId}`,
//       method: 'get',
//       // baseURL: baseURL,
//       responseType: 'blob'
//     })
//       .then((res) => res.data)
//       .catch((e) => {
//         console.error(e);
//       });
//   };

//   shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
//     if (this.props.voiceid !== nextProps.voiceid) {
//       this.wavesurfer && this.onAudioReady(this.wavesurfer);
//       return true;
//     } else if (nextState.showAudio !== this.state.showAudio) {
//       return true;
//     }
//     return false;
//   }

//   onAudioReady = async (wavesurferInstance) => {
//     const { voiceid, selectArea } = this.props;
//     if (!wavesurferInstance || !voiceid) return;
//     this.wavesurfer = wavesurferInstance;
//     const blob = await this.downloadFiles(voiceid);
//     if (!blob) return;
//     const url = window.URL.createObjectURL(blob);
//     this.wavesurfer?.load(url);

//     // 添加选中区域
//     selectArea?.forEach((k) => {
//       this.wavesurfer?.regions?.add({
//         start: k.start,
//         end: k.end,
//         loop: false,
//         color: 'rgba(82,41,63, 0.8)'
//       });
//     });

//     if (selectArea) {
//       setTimeout(() => {
//         this.wavesurfer?.regions?.disableDragSelection();
//       }, 200);
//     }

//     // 修复进度不统一的问题
//     this.wavesurfer?.on('seek', (k) => {
//       this.aduioRef?.setState({ currentTime: this.wavesurfer.getDuration() * k });
//       this.aduioRef?.forceUpdate();
//     });

//     // 修复播放进度条结束后不能到底的问题
//     this.wavesurfer?.on('finish', () => {
//       this.aduioRef?.setState({ currentTime: this.wavesurfer.getCurrentTime() });
//       this.aduioRef?.forceUpdate();
//     });

//     this.wavesurfer?.on('play', () => {
//       PubSub.publishSync('pause audio', this.state.singleId);
//     });
//   };

//   getAudioPlayer = () => {
//     return (
//       <AudioPlayer source={''} ref={(ref) => (this.aduioRef = ref)} config={defaultConfig} width={'100%' as any} height={200} onReady={this.onAudioReady} />
//     );
//   };

//   render() {
//     const { showAudio } = this.state;
//     const { suspension, inBox = true, voiceid } = this.props;
//     if (!voiceid) return null;
//     if (inBox === false) return this.getAudioPlayer();
//     return (
//       <div className="g-audio-wrap">
//         {suspension ? (
//           <i className="stop-icon" onClick={this.modalVisible} />
//         ) : (
//           <Button className="g-btn1" onClick={this.modalVisible}>
//             <i className="stop-icon" style={{ verticalAlign: 'middle', marginRight: '5px' }} />
//             <span style={{ verticalAlign: 'middle' }}>点击播放</span>
//           </Button>
//         )}
//         {showAudio && (
//           <Modal className="g-modal hide-all-btn" title="音频播放器" visible={true} onCancel={this.onClose} width={700}>
//             {this.getAudioPlayer()}
//           </Modal>
//         )}
//       </div>
//     );
//   }
// }

// export default AudioPlayerComponent;
