import { PlayerOptions } from 'nplayer';

export const showPlayControl = ['play', 'time', 'progress', 'web-fullscreen', 'fullscreen'];
export const hidePlayControl = ['time', 'progress', 'web-fullscreen', 'fullscreen'];

export const PlayerConfig = (options: { src: string; images: string[]; duration: number; size: number }): PlayerOptions => {
  const { src, images, duration, size } = options;
  const gapSecond = duration / (size * size);
  return {
    src,
    i18n: 'zh',
    // poster: poster, // 海报
    // posterEnable: false, //启用海报(关闭可点击设置进度)
    shortcut: false, // 开启快捷键
    isTouch: true, //响应式布局
    thumbnail: {
      startSecond: 0,
      gapSecond: gapSecond,
      col: size,
      row: size,
      width: 160,
      height: 90,
      images: [...images, 'http://localhost/images/M1.jpg']
    },
    contextMenus: [], // 空数组,不显示右键菜单
    controls: [
      // [
      //   'play',
      //   'progress',
      //   // 'volume', 'time', 'spacer', 'airplay', 'settings',
      //   'web-fullscreen',
      //   'fullscreen'
      // ]
    ],
    // 不根据窗口调整调整布局
    bpControls: {}
  };
};
