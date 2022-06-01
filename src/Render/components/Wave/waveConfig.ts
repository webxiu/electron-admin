export default {
  xAxisConfig: {
    xAxisHeight: 25,
    xAxisMinMs: 3000,
    tickCount: 22.6,
    font: '12px Arial 200',
    fillStyle: '#081B3A',
    gridFillColor: '#666',
    tickHeight: 5,
    labelColor: 'rgba(255, 255, 255, 0.65)'
  },
  playLineConfig: {
    lineWidth: 1
  },
  selectArea: {
    lineColor: 'rgb(235, 79, 79, 1)', //#eb5050
    // 通过颜色判断鼠标是否在选区刻度条上, 下面的88与上面的79不要设置相同
    backgroundColor: 'rgba(235, 88, 88, .5)'
  },
  smartSelectArea: {
    lineColor: '#51A1EB',
    backgroundColor: 'rgba(179,215,246, .3)'
  },
  /** 滑块 */
  scanMask: {
    lineWidth: 2,
    borderColor: 'rgba(21, 136, 204, 0.8)',
    backgroundColor: 'rgba(220,190,200,0.5)'
  },
  /** 滑块区域的选中颜色 */
  selectSliderColor: 'rgba(0, 56, 197, 0.5)',
  /** 手动标记区域 */
  signConfig: {
    height: 30,
    color: '#D37F00',
    backgroundColor: 'rgba(211, 127, 0, .3)'
  },
  /** 智能标记区域 */
  smartSignConfig: {
    height: 30,
    color: '#51A1EB',
    backgroundColor: 'rgba(179,215,246, .3)'
  },
  offsetLine: 5, // 选择线前后选中偏移量
  zoomStep: 60,
  waveScanHeight: 28,
  waveMaskColor: 'rgb(246, 182, 179)',
  threadNumber: 8, // 设置waveGraph的线程数
  mainWaveConfig: {
    Ystart: 0, //8
    xMap: [0, 1000],
    yMap: [0, 86, 173, 259, 346],
    rgb: {
      r: Array.from({ length: 256 }, (item, i) => i),
      g: Array.from({ length: 256 }, (item, i) => i),
      b: Array.from({ length: 256 }, (item, i) => i)
    },
    // 图谱背景色
    backgroudcolor: [255, 255, 255],
    // 图谱颜色
    wavecolor: [0, 0, 0]
  },
  copyByteSizeLimit: 1024 * 1024 * 1024 * 2, // 复制的字节大小限制2G
  zoomRatios: [
    { label: '100%', value: 100 },
    { label: '120%', value: 120 },
    { label: '240%', value: 240 },
    { label: '480%', value: 480 },
    { label: '1000%', value: 1000 },
    { label: '2000%', value: 2000 }
  ],
  playbackRates: [
    { label: '2.0x', value: 2 },
    { label: '1.5x', value: 1.5 },
    { label: '1.0x', value: 1 },
    { label: '0.75x', value: 0.75 },
    { label: '0.5x', value: 0.5 }
  ]
};
