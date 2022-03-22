type buffer = Uint8Array | Buffer;

export interface WaveInfo {
  SampleRate: number;
  BitsPerSample: number;
  Channels: number;
  Duration: number;
  HeaderLen: number;
  PCMSize: number;
  PCMEncoder: number;
}

export interface WaveEditParam {
  type: 'clear' | 'insert' | 'delete';
  positon: number;
  size?: number;
  data?: buffer;
}

export interface WaveEditResult {
  ok: boolean;
  type: string;
  index: number;
}

export interface WaveUndoResult {
  ok: boolean;
  type: string;
  index: number;
  positon: number;
  size: number;
  data: buffer;
}

declare let WaveGraph: {
  createEmptyDraw: (path: string, sampleRate: number, bitsPerSample: number, channes: number, initMS: number) => number;

  createDraw: (path: string) => number;

  releaseDraw: (id: number) => void;

  getPCMInfo: (id: number) => WaveInfo;

  setMillisPerColumn: (id: number, millis: number) => number;

  getMillisPerColumn: (id: number) => number;

  setThreadNumber: (id: number, threadsNum: number) => void;

  getThreadNumber: (id: number) => number;

  getTotalColumn: (id: number) => number;

  drawWaveFormAsync: (id: number, width: number, height: number, bitsPerSample: number, cb: (res: buffer) => void) => void;

  getGraphCanvasData: (params: {
    waveId: number; //createDraw返回的id
    height: number; //绘制的画布的高度
    width: number; //绘制的画布的宽度
    columnIndex: number; //开始绘制数据帧
    columnMs: number;
    columnCount: number; //绘制数据帧的数目
    Ystart: number; //最上面的虚线边框开始的值，可以用默认值
    xMap: Array<number>; //横坐标的虚线间隔
    yMap: Array<number>; //纵坐标的虚线间隔
    rgb: { r: number[]; g: number[]; b: number[] }; //这个是给语谱图用的参数，不需要更改，用默认的
    //wavecolor: Array<number>,//语谱图的颜色
    //backgroudcolor:Array<number>,//背景图的颜色
    cb: (buf: buffer) => void; //回调函数，返回的RGB值
  }) => void;

  /*
	WaveEdit/Undo function will modified the pcm size,
	call genColumns&getPCMDuration to update relative infomation
	warning: call getPCMInfo will be incorrect ,reference getPCMInfo to get more infomation
	*/
  editWave: (id: number, param: WaveEditParam, cb: (res: WaveEditResult) => void) => void;

  undoEdit: (id: number, cb: (res: WaveUndoResult) => void) => void;

  jumpEdit: (id: number, index: number, cb: (res: WaveUndoResult) => void) => void;

  saveEdit: (id: number, path: string, cb: (res: boolean) => void) => void;

  getEditHistoryDepth: (id: number) => number;

  getEditCurrentDepth: (id: number) => number;

  getPCMDuration: (id: number) => number;

  getData: (id: number, beginMills: number, endMills: number) => buffer;
};

export default WaveGraph;
