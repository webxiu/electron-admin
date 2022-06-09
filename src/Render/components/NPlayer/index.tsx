import Player, { EVENT } from 'nplayer';
import { PlayerConfig, hidePlayControl, showPlayControl } from './config';
import React, { RefObject, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

import { AppEventNames } from '~/src/Types/EventTypes';
import PubSub from 'pubsub-js';
import utils from '@/Render/utils';

export interface RefType {
  videoInstans: Player | undefined;
  setMuted: (isMuted: boolean) => void;
  updateControlItem: (showPlay: boolean) => void;
}

export enum VIDEO_STATUS {
  play = 'play',
  pause = 'pause',
  seek = 'seek',
  speed = 'speed'
}
export interface VideoParamsType {
  type: VIDEO_STATUS;
  currentTime: number;
  waveFileId: number;
  speed?: number;
}

interface Props {
  /** 音频id */
  fileId: number;
  /** 总时长 */
  duration: number;
  /** 播放地址 */
  src: string;
  /** 预览图8 x 8 的雪碧图，每个雪碧图中小缩略图的尺寸是 160 x 90 */
  images: string[];
  ref?: RefObject<RefType>;
}

const NPlayer = forwardRef((props: Props, ref) => {
  const { fileId, src, duration, images } = props;
  const videoRef = useRef<Player>();
  const mutedRef = useRef<boolean>(true);
  const renderClock = useRef<boolean>(false);

  useImperativeHandle(ref, () => ({
    setMuted,
    updateControlItem,
    videoInstans: videoRef.current
  }));

  useEffect(() => {
    PubSub.subscribe(AppEventNames.WAVE_IS_EDIT, (msg: string, params) => {
      const { editDepNum } = params;
      // ***如果图谱被编辑, 视频设置为静音, 音视频分开播放***
      if (editDepNum > 0) {
        setMuted(false);
        updateControlItem(true);
      } else {
        setMuted(true);
        updateControlItem(false);
        videoRef.current?.pause();
      }
    });
    return () => {
      PubSub.unsubscribe(AppEventNames.WAVE_IS_EDIT);
    };
  }, [videoRef.current]);

  useEffect(() => {
    initPlayer(src, images);
    setPlayTooltipText();
    PubSub.subscribe(AppEventNames.CONTROL_VIDEO, (msg: string, params) => {
      // ***如果视频不是静音, 分开播放, 阻止联动播放***
      if (mutedRef.current) {
        onReceiveEvent(params);
      }
    });
    return () => {
      PubSub.unsubscribe(AppEventNames.CONTROL_VIDEO);
    };
  }, [src, images]);

  const initPlayer = useCallback(
    (src: string, images: string[]) => {
      if (videoRef.current) return;
      const opts = PlayerConfig({
        src: src,
        images: images,
        duration: duration,
        size: 8
      });
      const player: Player = new Player(opts);
      player.mount('#player');
      videoRef.current = player;
      player.muted = true; // 是否静音
      player.on(EVENT.PLAY, (e) => onPlayerEvent(VIDEO_STATUS.play, player));
      player.on(EVENT.PAUSE, (e) => onPlayerEvent(VIDEO_STATUS.pause, player));
      player.on(EVENT.SEEKED, (e) => onPlayerEvent(VIDEO_STATUS.seek, player));
      player.on(EVENT.ENTER_FULLSCREEN, (e) => setPlayTooltipText('window', true));
      player.on(EVENT.EXIT_FULLSCREEN, (e) => setPlayTooltipText('window', false));
      player.on(EVENT.WEB_ENTER_FULLSCREEN, (e) => setPlayTooltipText('web', true));
      player.on(EVENT.WEB_EXIT_FULLSCREEN, (e) => setPlayTooltipText('web', false));
      // 默认不显示播放按钮
      updateControlItem(false);
    },
    [videoRef]
  );

  /** 修改播放标题多语言显示 */
  const setPlayTooltipText = (type?: 'web' | 'window', isFull?: boolean) => {
    const webFullScreenDom = document.querySelector(`.nplayer_tooltip_content`);
    const winFullScreenDom = document.querySelector(`.nplayer_tooltip_content.nplayer_tooltip-right`);
    if (!webFullScreenDom || !winFullScreenDom) return;
    const timer = setTimeout(() => {
      if (type === 'web') {
        webFullScreenDom.innerHTML = isFull ? '退出窗口全屏' : '窗口全屏';
      } else if (type === 'window') {
        winFullScreenDom.innerHTML = isFull ? '退出全屏' : '全屏';
      } else {
        webFullScreenDom.innerHTML = '窗口全屏';
        winFullScreenDom.innerHTML = '全屏';
      }
      clearTimeout(timer);
    }, 200);
  };

  /** 接收图谱事件 */
  const onReceiveEvent = (params: VideoParamsType) => {
    let { type, currentTime, speed, waveFileId } = params;
    if (!videoRef.current || fileId !== waveFileId) return;

    renderClock.current = false;
    currentTime && (videoRef.current.currentTime = currentTime);
    if (type === VIDEO_STATUS.play) {
      videoRef.current.seek(currentTime);
      videoRef.current.play();
    } else if (type === VIDEO_STATUS.pause) {
      currentTime && videoRef.current.seek(currentTime);
      videoRef.current.pause();
      videoRef.current.loading.hide();
    } else if (type === VIDEO_STATUS.speed) {
      videoRef.current.playbackRate = speed as number;
    }
  };

  /** 发送事件到图谱 */
  const onPlayerEvent = utils.debounce((type: VIDEO_STATUS, player: Player) => {
    const { currentTime, playing } = player; // currentTime: 播放时间(秒)
    // *** 如果视频不是静音, 分开播放, 阻止联动播放***
    if (!mutedRef.current) return;
    const timer = setTimeout(() => {
      if (!renderClock.current) return;
      if (type !== VIDEO_STATUS.seek) {
        playing ? player.play() : player.pause();
      }
      PubSub.publish(AppEventNames.CONTROL_WAVE, { type, data: { currentTime: currentTime < 0.5 ? 0 : currentTime, playing, videoFileId: fileId } });
      clearTimeout(timer);
    }, 30);
  });

  /** 设置是否静音 */
  const setMuted = (isMuted: boolean) => {
    mutedRef.current = isMuted;
    if (!videoRef.current) return;
    if (videoRef.current.muted) {
      if (!isMuted) {
        videoRef.current.toggleVolume();
      }
    } else {
      if (isMuted) {
        videoRef.current.toggleVolume();
      }
    }
  };

  /** 设置是否显示播放按钮 */
  const updateControlItem = (showPlay: boolean) => {
    if (!videoRef.current) return;
    if (showPlay) {
      videoRef.current.updateControlItems([], 0);
      videoRef.current.updateControlItems(showPlayControl, 1);
    } else {
      videoRef.current.updateControlItems([], 1);
      videoRef.current.updateControlItems(hidePlayControl, 0);
    }
  };

  return (
    <div id="player" className="flex-1 ui-ov-h" onClick={() => (renderClock.current = true)}>
      <style jsx global>{`
        #player .nplayer_progress_bars {
          height: 2px;
        }
        #player .nplayer_tooltip svg {
          height: 22px;
          width: 22px;
        }
        #player .nplayer_progress_dot_inner {
          height: 10px;
          width: 10px;
        }
        #player .nplayer_tooltip:hover svg {
          fill: #009ee9;
        }
        #player .nplayer_tooltip:hover {
          background: transparent;
        }
        #player .nplayer_control {
          padding-bottom: 0px;
        }

        #player .nplayer-loading .nplayer_loading {
          display: none;
        }
      `}</style>
    </div>
  );
});

export default NPlayer;
