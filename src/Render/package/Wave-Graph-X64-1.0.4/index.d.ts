type buffer = Uint8Array | Buffer;

interface WaveInfo {
  SampleRate: number;
  BitsPerSample: number;
  Channels: number;
  Duration: number;
  HeaderLen: number;
  PCMSize: number;
  PCMEncoder: number;
}

interface WaveEditParam {
  type: 'clear' | 'insert' | 'delete';
  positon: number;
  size: number;
  data: buffer;
}

interface WaveEditResult {
  ok: boolean;
  type: string;
  index: number;
}

interface WaveUndoResult {
  ok: boolean;
  type: string;
  index: number;
  positon: number;
  size: number;
  data: buffer;
}

declare let WaveGraph: {
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
    waveId: number;
    height: number;
    columnIndex: number;
    columnCount: number;
    width: number;
    Ystart: number;
    xMap: Array<number>;
    yMap: Array<number>;
    rgb: { r: number[]; g: number[]; b: number[] };
    cb: (buf: buffer) => void;
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
