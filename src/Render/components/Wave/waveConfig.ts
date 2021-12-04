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
    lineColor: '#eb5050',
    backgroundColor: 'rgba(235, 80, 80, .5)'
  },
  smartSelectArea: {
    lineColor: '#51A1EB',
    backgroundColor: 'rgba(179,215,246, .3)'
  },
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
  scanMask: {
    borderColor: '#e09b11',
    backgroundColor: 'rgba(220,220,220,1)'
  },
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
    backgroudcolor: [0, 0, 0], // 图谱背景色
    wavecolor: [0, 238, 152] // 图谱颜色
  },
  copyByteSizeLimit: 1024 * 1024 * 1024 * 2, // 复制的字节大小限制2G
  playbackRates: [
    { label: '2.0x', value: 2 },
    { label: '1.5x', value: 1.5 },
    { label: '1.0x', value: 1 },
    { label: '0.75x', value: 0.75 },
    { label: '0.5x', value: 0.5 }
  ]
};