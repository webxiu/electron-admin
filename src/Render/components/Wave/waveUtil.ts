export default {
  drawOnePixelLineTo(ctx, fromX, fromY, toX, toY, backgroundColor, lineWidth = 1) {
    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.strokeStyle = backgroundColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = backgroundColor;
  },
  msToPx(totalMs: number, totalPx: number, nowMs: number, zoom: number) {
    const ghostPx = totalPx * (zoom / 100);
    const ghostPerPxMeanMs = totalMs / ghostPx;
    const actualPx = nowMs / ghostPerPxMeanMs;
    return Math.floor(actualPx);
  },
  pxToMs(totalMs: number, totalPx: number, nowPx: number, zoom: number) {
    const ghostPx = totalPx * (zoom / 100);
    const ghostPerPxMeanMs = totalMs / ghostPx;
    const actualMs = nowPx * ghostPerPxMeanMs;
    return Math.floor(actualMs);
  },
  getNowHeight(v) {
    return Math.floor((v / 100) * 100);
  },
  secondsToMinutes(ms) {
    const seconds = Math.floor(ms / 1000);
    let timeArr: number[] = [];
    const hours = seconds / 60 / 60,
      minutes = (seconds / 60) % 60,
      lastSeconds = seconds % 60,
      millisecond = ms % 1000;

    if (seconds >= 3600) {
      timeArr = [parseInt(`${hours}`), parseInt(`${minutes}`), parseInt(`${lastSeconds}`)];
    } else {
      timeArr = [parseInt(`${minutes}`), parseInt(`${lastSeconds}`)];
    }
    return timeArr
      .join(':')
      .concat('.' + parseInt(`${millisecond}`))
      .replace(/\b(\d)\b/g, '0$1')
      .replace(/[^.]*$/, (s) => s.padStart(3, '0'));
  },
  getWavBuffer(data: Buffer | Uint8Array, sampleRate: number, channels = 1) {
    const buff = new Buffer(data.byteLength + 44);
    const dataLength = data.byteLength;
    const sampleRateTmp = sampleRate;
    const sampleBits = 16;
    let offset = 0;
    /* 资源交换文件标识符 */
    buff.write('RIFF', offset, 4);
    offset += 4;
    /* 下个地址开始到文件尾总字节数,即文件大小-8 */
    buff.writeInt32LE(36 + dataLength, offset);
    offset += 4;
    /* WAV文件标志 */
    buff.write('WAVE', offset, 4);
    offset += 4;
    /* 波形格式标志 */
    buff.write('fmt ', offset, 4);
    offset += 4;
    /* 过滤字节,一般为 0x10 = 16 */
    buff.writeInt32LE(16, offset);
    offset += 4;
    /* 格式类别 (PCM形式采样数据) */
    buff.writeInt16LE(1, offset);
    offset += 2;
    /* 通道数 */
    buff.writeInt16LE(channels, offset);
    offset += 2;
    /* 采样率,每秒样本数,表示每个通道的播放速度 */
    buff.writeInt32LE(sampleRateTmp, offset);
    offset += 4;
    /* 波形数据传输率 (每秒平均字节数) 通道数×每秒数据位数×每样本数据位/8 */
    buff.writeInt32LE(sampleRateTmp * channels * (sampleBits / 8), offset);
    offset += 4;
    /* 快数据调整数 采样一次占用字节数 通道数×每样本的数据位数/8 */
    buff.writeInt16LE(channels * (sampleBits / 8), offset);
    offset += 2;
    /* 每样本数据位数 */
    buff.writeInt16LE(sampleBits, offset);
    offset += 2;
    /* 数据标识符 */
    buff.write('data', offset);
    offset += 4;
    /* 采样数据总数,即数据总大小-44 */
    buff.writeInt32LE(dataLength, offset);
    offset += 4;
    /** 设置数据 */ buff.set(data, offset);
    return buff;
  }
};
