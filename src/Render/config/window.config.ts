import { remote } from 'electron';

/**
 * 动态设置窗口宽高
 * @param width 设置窗口宽度
 * @param height 设置窗口高度
 * @param restore 是否设置为小窗口
 */
export const setWindowSize = (width = 1440, height = 800, restore?: boolean) => {
  if (restore) {
    remote.getCurrentWindow().restore();
  }
  remote.getCurrentWindow().setSize(width, height);
};
