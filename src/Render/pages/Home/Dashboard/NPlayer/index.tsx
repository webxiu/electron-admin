import { Button, Slider } from 'antd';
import React, { useEffect, useRef } from 'react';

import Player from 'nplayer';
import poster from './images/poster.png';

const Wrap = () => {
  let videoRef = useRef<Player>();
  const src = 'G:/dev/视频/视频.mp4';
  useEffect(() => {
    if (!videoRef.current) {
      const player: Player = new Player({
        src,
        thumbnail: {
          startSecond: 1,
          gapSecond: 10,
          col: 5,
          row: 5,
          width: 160,
          height: 90,
          images: [
            'http://localhost/images/M1.jpg'
            // 'http://localhost/images/M2.jpg',
            // 'http://localhost/images/M3.jpg',
            // 'http://localhost/images/M4.jpg'
          ]
        },
        isTouch: true, //响应式布局
        controls: [
          [
            // 'play',
            // 'spacer',
            'progress',
            // 'volume', 'time', 'spacer', 'airplay', 'settings',
            'web-fullscreen',
            'fullscreen'
          ]
          // ['progress']
        ],
        poster: poster, // 海报
        posterEnable: true, //启用海报
        i18n: 'en'
      });
      player.mount('#player');
      player.toggleVolume();
      videoRef.current = player;
    }
  }, [src, videoRef]);

  const setCurrentTime = (val) => {
    videoRef.current?.seek(val);
  };

  const onAfterChange = (e) => {
    videoRef.current?.play();
  };

  const onPlay = () => {
    videoRef.current?.play();
    console.log('play', videoRef.current?.duration);
  };
  const onPause = () => {
    videoRef.current?.pause();
    console.log('pause');
  };
  videoRef.current?.on('progress', (e) => {
    console.log('Progress', e);
  });

  return (
    <div>
      {/* <Button onClick={setCurrentTime}>设置时间</Button> */}
      <Button onClick={onPlay}>播放</Button>
      <Button onClick={onPause}>暂停</Button>
      <div>
        <Slider defaultValue={0} max={videoRef.current?.duration} onChange={setCurrentTime} onAfterChange={onAfterChange} />
      </div>
      <div id="player" style={{ height: 480 }}></div>
      <style jsx>{`
        .player {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default Wrap;
