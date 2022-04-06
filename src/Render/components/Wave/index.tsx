import { Button, Popover, Select, Spin, message } from 'antd';
import React, { Component, createRef } from 'react';
import { execFfmpeg, sampleObj, saveFfmpeg } from './ffmpeg';
import { inject, observer } from 'mobx-react';
import waveGraph, { WaveEditParam, WaveEditResult, WaveUndoResult } from '@/Render/package/Wave-Graph-X64';

import { AppEventNames } from '~/src/Types/EventTypes';
import Mousetrap from 'mousetrap';
import PubSub from 'pubsub-js';
import SignTable from './components/SignTable';
import atlas_big from '@/Render/assets/img/wave/atlas_big.png';
import atlas_eyesclose from '@/Render/assets/img/wave/atlas_eyesclose.png';
import atlas_eyesopen from '@/Render/assets/img/wave/atlas_eyesopen.png';
import atlas_label from '@/Render/assets/img/wave/atlas_label.png';
import atlas_play from '@/Render/assets/img/wave/atlas_play.png';
import atlas_sign from '@/Render/assets/img/wave/atlas_sign.png';
import atlas_sma from '@/Render/assets/img/wave/atlas_sma.png';
import atlas_stop from '@/Render/assets/img/wave/atlas_stop.png';
import { download } from '../../service';
import fs from 'fs';
import more_signclose from '@/Render/assets/img/wave/more_signclose.png';
import more_signopen from '@/Render/assets/img/wave/more_signopen.png';
import { onExportSign } from '@/Render/components/ExportSignsToExcel';
import path from 'path';
import { readFile } from '@/Render/utils/fs';
import { t } from 'i18next';
import { toJS } from 'mobx';
import utils from '@/Render/utils';
import { v4 as uuidv4 } from 'uuid';
import waveConfig from './waveConfig';
import waveUtil from './waveUtil';

// import waveGraph2, { WaveEditParam, WaveEditResult, WaveUndoResult } from '@spk/Wave-Graph-X64';

console.log(`WaveGraph`, waveGraph);
export type SignProps = {
  startTime: number;
  endTime: number;
  name: string;
  poss?: number;
  signCate?: number;
  id?: string;
  isManual: boolean;
  isVisible?: boolean;
};

/** 智能标记类型 */
export interface SmartSignType {
  /** 开始时间(ms) */
  begin_time: number;
  /** 结束时间(ms) */
  end_time: number;
  /** 标记名称 */
  name?: string;
  /** 相似度(以音搜音) */
  poss?: number;
  /** 标记分类 */
  signCate?: number;
}

interface DeleteSignsType {
  /** 删除的标记 */
  deleteSigns: SignProps[];
  /** 选中的开始时间 */
  startTime: number;
  /** 选中的结束时间 */
  endTime: number;
  /** 需要改变重新加减标记时间的id */
  changeTimeIds: string[];
  /** 删除减少或粘贴增加区域 */
  editType: 'add' | 'sub';
}

type TProps = {
  className?: string;
  /** 当前选中区域 */
  onSelectAreaChange?: (start: number, end: number) => void;
  /** 点击添加标记 */
  onClickAddSign?: () => void;
  filePath?: string;
  fileId: number;
  /** 智能标记区域 */
  smartSign?: SmartSignType[];
  /** 获取总时长 */
  onDuration?: (totalTime: number) => void;
  /** 选中区域 */
  selectArea?: {
    start_time: number;
    end_time: number;
  };
  /** 双击标注，进行编辑或者删除 */
  onDoubleClickSign?: (item: SignProps) => void;
  /** 双击智能标注，进行查看 */
  onDoubleClickSmartSign?: (item: SignProps) => void;
  /** 是否显示添加按钮 */
  showAddBtn?: boolean;
  /** 是否显示智能标注栏 */
  showSmartSign?: boolean;
  /** 是否显示手动标注栏 */
  showManualSign?: boolean;
  /** 当前激活的fileId */
  activeFileId?: string;
  Global?: any;
  /** 音频绘制完成回调 */
  onDrawMainWaveFinish?: (params) => void;
  /** 是否显示选区时间 */
  showSelectArea?: boolean;
  /** 智能标注区域的标注标题 */
  smartSignTitle?: string;
  /** 是否为以音搜音图谱(用于标注折叠表格配置) */
  isSearchVoiceSign?: boolean;
  /** 不同标记颜色 */
  signsColors?: string[];
};

type TState = {
  playing: boolean;
  zoom: number;
  playCurrentTime: number;
  addModalVisible: boolean;
  signName: string;
  signVisible: boolean;
  smartSignVisible: boolean;
  manualSigns: SignProps[];
  smartSignListVisible: boolean;
  manualSignListVisible: boolean;
  hasEdit: boolean;
  mainLoading: boolean;
  scanLoading: boolean;
  playbackRateVisible: boolean;
  playbackRate: { label: string; value: number };
  /** 是否为合法文件 */
  isValidFile: boolean;
  zoomRatio: number | string;
};

const noop = () => {};
let cacheWaveId = {};

@inject('Global')
@observer
class Wave extends Component<TProps, TState> {
  domRefs = {
    scanWaveRef: createRef<HTMLCanvasElement>(),
    scanSliderRef: createRef<HTMLCanvasElement>(),
    bgWaveRef: createRef<HTMLCanvasElement>(),
    mainWaveRef: createRef<HTMLCanvasElement>(),
    xAxisRef: createRef<HTMLCanvasElement>(),
    yAxisRef: createRef<HTMLCanvasElement>(),
    clientRef: createRef<HTMLDivElement>(),
    signRef: createRef<HTMLCanvasElement>(),
    smartSignRef: createRef<HTMLCanvasElement>()
  };
  scanSliderCtx: CanvasRenderingContext2D;
  scanWaveCtx: CanvasRenderingContext2D;
  mainCtx: CanvasRenderingContext2D;
  bgCtx: CanvasRenderingContext2D;
  xAxisCtx: CanvasRenderingContext2D;
  yAxisCtx: CanvasRenderingContext2D;
  signCtx: CanvasRenderingContext2D;
  smartSignCtx: CanvasRenderingContext2D;
  mainWaveWidth = 0;
  mainWaveHeight = 0;
  sampleRate = 0;
  sampleBits = 0;
  waveId = -1;
  totalMs = 0;
  drawTotalMs = 0;
  audio: HTMLAudioElement;
  animationId = 0;
  selectStartMs = 0;
  selectEndMs = 0;
  isDrawing = false;
  scanStartX = 0;
  prevScanStartX = 0;
  currentScanStartX = 0;
  scanSliderWidth = 0;
  actualPerPxMeamMs = 0;
  signAll: SignProps[] = [];
  operationRecord: DeleteSignsType[] = [];
  playList: { startTime: number; endTime: number }[] = [];
  playIndex = 0;
  isManual = true;
  state = {
    playing: false,
    zoom: waveConfig.zoomRatios[0].value,
    playCurrentTime: 0,
    addModalVisible: false,
    signName: '',
    signVisible: true,
    smartSignVisible: true,
    manualSigns: [],
    smartSignListVisible: false,
    manualSignListVisible: false,
    hasEdit: false,
    mainLoading: false,
    scanLoading: false,
    playbackRateVisible: false,
    playbackRate: waveConfig.playbackRates[2],
    isValidFile: true,
    zoomRatio: waveConfig.zoomRatios[0].value
  };
  filePath = this.props.filePath || '';
  subToken = '';
  fileId = 0;
  pcmSize = 0; // 总字节数
  Maximize = false;
  isFirstUplod = true;
  yAxisWidth = 30;
  xAxisStartMs = 0; // 图谱可视区域的开始时间(滚动变化)

  constructor(props) {
    super(props);
    this.handleResize = utils.debounce(this.resize);
  }

  handleResize: () => void;
  componentDidMount() {
    this.initCanvas();
    this.loadFile();
    window.addEventListener(
      'click',
      utils.debounce(() => {
        this.setState({ playbackRateVisible: false });
      })
    );

    window.addEventListener('resize', this.handleResize);
    this.subToken = PubSub.subscribe('stopAllAudio', (name: string, isPlay: boolean) => {
      this.pause();
    });

    PubSub.subscribe(AppEventNames.WAVE_ACTION, (msg: string, data) => {
      this.waveAction(data);
    });

    /** 导出标注 */
    PubSub.subscribe(AppEventNames.EXPORT_MARK, (msg: string, data: { src: string; fileName: string; fileId: number }) => {
      const { fileId, activeFileId } = this.props;
      if (data.fileId === fileId && this.signAll.length) {
        const singDatas =
          this.signAll?.map((item) => ({
            [`标注类型`]: item.isManual ? '自定义标注' : '智能标注',
            [`标注内容`]: item.name,
            [`开始时间`]: utils.toHHmmss(item.startTime),
            [`结束时间`]: utils.toHHmmss(item.endTime),
            [`时长`]: utils.toHHmmss(item.endTime - item.startTime),
            [`标注者`]: 'admin'
          })) || [];
        onExportSign(singDatas, data);
      }
    });
  }

  componentWillUnmount() {
    this.pause();
    cacheWaveId = {};
    Mousetrap.unbind('space');
    waveGraph.releaseDraw(this.waveId);
    PubSub.unsubscribe(this.subToken);
    PubSub.unsubscribe(AppEventNames.WAVE_ACTION);
    window.removeEventListener('resize', this.handleResize);
  }

  resize = () => {
    if (!this.state.isValidFile) return;
    this.Maximize = true;
    this.initCanvas();
    this.reDraw();
    this.drawSign();
    this.drawMultiSelectArea();
    if (this.selectStartMs > 0 && this.selectEndMs > 0) {
      this.drawSelectArea(this.selectStartMs, this.selectEndMs, true);
    }
  };

  componentDidUpdate(prevProps: TProps, prevState: TState) {
    const { fileId, activeFileId } = this.props;
    if (!this.state.isValidFile) return;
    if (prevProps.activeFileId === activeFileId) {
      return;
    }
    if (this.Maximize) {
      if (activeFileId && fileId === Number(activeFileId)) {
        this.initCanvas();
        this.reDraw();
        this.drawSign();
        this.drawMultiSelectArea();
        this.Maximize = false;
      }
    }
  }

  initCanvas = () => {
    const { scanWaveRef, bgWaveRef, mainWaveRef, clientRef, xAxisRef, yAxisRef, scanSliderRef, signRef, smartSignRef } = this.domRefs;
    if (
      !clientRef.current ||
      !mainWaveRef.current ||
      !scanWaveRef.current ||
      !xAxisRef.current ||
      !yAxisRef.current ||
      !bgWaveRef.current ||
      !scanSliderRef.current ||
      !signRef.current
    )
      return;

    const clientRect = clientRef.current?.getBoundingClientRect() as DOMRect;

    // 设置智能标注
    if (this.props.showSmartSign && smartSignRef.current) {
      smartSignRef.current.width = Math.floor(clientRect.width);
      smartSignRef.current.height = waveConfig.smartSignConfig.height;
      this.smartSignCtx = smartSignRef.current.getContext('2d') as CanvasRenderingContext2D;
    }
    const tHeight = 187; //固定图谱高度 clientRect.height

    // 设置主波形图的canvas的宽高
    mainWaveRef.current.width = Math.floor(clientRect.width);
    mainWaveRef.current.height = Math.floor(clientRect.height);
    // 设置背景canvas的宽高
    bgWaveRef.current.width = Math.floor(clientRect.width);
    bgWaveRef.current.height = Math.floor(clientRect.height);
    // 设置预览canvas的宽高
    scanWaveRef.current.width = Math.floor(clientRect.width);
    scanWaveRef.current.height = waveConfig.waveScanHeight;
    // 设置滑块canvas区域的宽高
    scanSliderRef.current.width = Math.floor(clientRect.width);
    scanSliderRef.current.height = waveConfig.waveScanHeight;
    // 设置x轴canvas的宽高
    xAxisRef.current.width = Math.floor(clientRect.width);
    xAxisRef.current.height = waveConfig.xAxisConfig.xAxisHeight;

    // 设置y轴canvas的宽高
    yAxisRef.current.width = this.yAxisWidth;
    yAxisRef.current.height = Math.floor(tHeight) + 30;

    signRef.current.width = Math.floor(clientRect.width);
    signRef.current.height = waveConfig.signConfig.height;

    this.scanWaveCtx = scanWaveRef.current.getContext('2d') as CanvasRenderingContext2D;
    this.scanSliderCtx = scanSliderRef.current.getContext('2d') as CanvasRenderingContext2D;
    this.xAxisCtx = xAxisRef.current.getContext('2d') as CanvasRenderingContext2D;
    this.yAxisCtx = yAxisRef.current.getContext('2d') as CanvasRenderingContext2D;
    this.bgCtx = bgWaveRef.current.getContext('2d') as CanvasRenderingContext2D;
    this.mainCtx = mainWaveRef.current.getContext('2d') as CanvasRenderingContext2D;
    this.signCtx = signRef.current.getContext('2d') as CanvasRenderingContext2D;
    this.mainWaveWidth = Math.floor(clientRect.width);
    // this.mainWaveHeight = Math.floor(clientRect.height);
    this.mainWaveHeight = Math.floor(tHeight);
  };

  getWaveHead = () => {
    const { zoom } = this.state;
    const { threadNumber } = waveConfig;
    // 获取音频头部信息
    const waveHead = waveGraph.getPCMInfo(this.waveId);
    this.sampleBits = waveHead.BitsPerSample;
    this.sampleRate = waveHead.SampleRate;
    this.totalMs = waveHead.Duration;
    this.pcmSize = waveHead.PCMSize;
    // 默认是以原始音频的总时间长度去绘制坐标轴
    this.drawTotalMs = waveHead.Duration;
    waveGraph.setThreadNumber(this.waveId, threadNumber);
    const actualMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, this.mainWaveWidth, zoom);
    this.actualPerPxMeamMs = actualMs / this.mainWaveWidth;
    waveGraph.setMillisPerColumn(this.waveId, this.actualPerPxMeamMs);
    this.forceUpdate();
  };

  isExistPath = (filePath = this.filePath) => {
    if (fs.existsSync(filePath)) {
      this.setState({ isValidFile: true });
      return true;
    } else {
      this.setState({ isValidFile: false });
      return false;
    }
  };

  loadFile = async () => {
    const { onDuration = noop, selectArea, smartSign = [] } = this.props;

    if (cacheWaveId[this.props.fileId]) return;
    await this.loadAudio().catch(console.error);
    if (!this.isExistPath()) return;
    this.waveId = waveGraph.createDraw(this.filePath);
    if (!this.isExistPath()) return;
    if (this.waveId === -1) {
      console.error('文件读取失败！');
      return;
    }
    cacheWaveId[this.props.fileId] = this.waveId;
    this.getWaveHead();

    onDuration(this.totalMs);
    this.drawMainWave();
    this.drawWaveScan();
    this.drawScanSlider();
    this.drawXAxis(0);
    // 绘制初始的播放进度线
    if (selectArea && selectArea.start_time !== selectArea.end_time) {
      this.selectStartMs = selectArea.start_time;
      this.selectEndMs = selectArea.end_time;
    }
    if (smartSign && smartSign.length) {
      this.signAll = this.signAll.filter((k) => k.isManual);
      smartSign.forEach((k, idx) => {
        this.signAll.push({
          startTime: k.begin_time,
          endTime: k.end_time,
          name: k.name || '',
          poss: k.poss,
          signCate: k.signCate,
          id: uuidv4(),
          isManual: false,
          isVisible: true
        });
      });
    }
    this.drawMultiSelectArea();
    this.drawTimeLine(0, false);
    this.drawSign();
  };

  // 加载播放器组件
  loadAudio = async () => {
    if (this.props.fileId) {
      const data: any = await download({ file_id: this.props.fileId }).catch(console.error);
      this.filePath = data.data?.data?.src;
    }
    this.audio = new Audio();
    this.audio.src = `file:\\\\\\${this.filePath}`;
  };

  // 绘制预览图
  drawWaveScan = () => {
    const { waveScanHeight } = waveConfig;
    // this.setState({ scanLoading: true });
    waveGraph.drawWaveFormAsync(this.waveId, this.mainWaveWidth, waveScanHeight, this.sampleBits, (res) => {
      if (!res || !res.length || res.length !== this.mainWaveWidth * waveScanHeight) return;
      const tmp = new OffscreenCanvas(this.mainWaveWidth, waveScanHeight);
      const imgData = new ImageData(this.mainWaveWidth, waveScanHeight);
      const buff = imgData.data;
      let idx, v;
      for (let y = 0; y < waveScanHeight; y++) {
        for (let x = 0; x < this.mainWaveWidth; x++) {
          idx = y * this.mainWaveWidth + x;
          v = res[(waveScanHeight - y - 1) * this.mainWaveWidth + x];
          idx = idx * 4;
          if (v === 1) {
            buff[idx] = 75;
            buff[idx + 1] = 243;
            buff[idx + 2] = 167;
            buff[idx + 3] = 255;
          } else {
            buff[idx + 0] = 0;
            buff[idx + 1] = 0;
            buff[idx + 2] = 0;
            buff[idx + 3] = 255;
          }
        }
      }
      const tmpCtx = tmp.getContext('2d') as OffscreenCanvasRenderingContext2D;
      tmpCtx.fillStyle = '#000';
      tmpCtx.fillRect(0, 0, this.mainWaveWidth, waveScanHeight);
      tmpCtx.putImageData(imgData, 0, 0);
      const wavCtxData = tmp.transferToImageBitmap();
      this.scanWaveCtx.drawImage(wavCtxData, 0, 0);
      // this.setState({ scanLoading: false });
    });
  };

  // 绘制预览的滑块
  drawScanSlider = (startX = 0, setPrevStartX = true) => {
    const { zoom } = this.state;
    const { scanMask, waveScanHeight, selectSliderColor } = waveConfig;
    this.scanSliderWidth = this.mainWaveWidth / (zoom / 100);
    if (setPrevStartX) this.prevScanStartX = startX;
    this.currentScanStartX = startX;
    this.scanSliderCtx.clearRect(0, 0, this.mainWaveWidth, waveScanHeight);
    this.scanSliderCtx.strokeStyle = scanMask.borderColor;
    this.scanSliderCtx.fillStyle = scanMask.backgroundColor;
    this.scanSliderCtx.lineWidth = scanMask.lineWidth;
    this.scanSliderCtx.fillRect(startX, 0, this.scanSliderWidth, waveScanHeight);
    this.scanSliderCtx.strokeRect(startX + scanMask.lineWidth / 2, 1, this.scanSliderWidth - scanMask.lineWidth, waveScanHeight - scanMask.lineWidth);
    this.scanSliderCtx.stroke();

    // 选区超出左边和右边限制
    const xSelectMaxMs = this.xAxisStartMs + this.actualPerPxMeamMs * this.mainWaveWidth;
    if (this.selectEndMs < this.xAxisStartMs) {
      this.selectEndMs = this.xAxisStartMs;
    } else if (this.selectEndMs > xSelectMaxMs) {
      this.selectEndMs = xSelectMaxMs;
    }

    if (this.selectStartMs) {
      this.scanSliderCtx.fillStyle = selectSliderColor;
      const x = (this.selectStartMs / this.totalMs) * this.mainWaveWidth;
      const w = ((this.selectEndMs - this.selectStartMs) / this.totalMs) * this.mainWaveWidth;
      this.scanSliderCtx.fillRect(x, 0, w, waveScanHeight);
      this.scanSliderCtx.stroke();
    }
  };

  // 绘制主区域波形图
  drawMainWave = (startMs = 0) => {
    const { zoom } = this.state;
    const { onDrawMainWaveFinish = noop } = this.props;
    const { yMap, Ystart, xMap, rgb, backgroudcolor, wavecolor } = waveConfig.mainWaveConfig;
    const startPx = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, startMs, zoom);

    return new Promise((resolve) => {
      const params = {
        waveId: this.waveId,
        height: this.mainWaveHeight,
        columnIndex: startPx,
        columnCount: this.mainWaveWidth,
        columnMs: startMs,
        width: this.mainWaveWidth,
        Ystart,
        xMap,
        yMap,
        rgb
        // backgroudcolor,
        // wavecolor
      };
      // this.setState({ mainLoading: true });
      waveGraph.getGraphCanvasData({
        ...params,
        cb: (buff) => {
          // 将uint8Array类型的buff转化为Uint8ClampedArray
          const uint8ClapedBuf = new Uint8ClampedArray(Array.from(buff));
          const imageData = new ImageData(uint8ClapedBuf, this.mainWaveWidth, this.mainWaveHeight);
          /** ======= 设置颜色 start ====== */
          const [br, bg, bb] = backgroudcolor;
          const [cr, cg, cb] = wavecolor;
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] === 49 && data[i + 1] === 49 && data[i + 2] === 49) {
              data[i] = cr;
              data[i + 1] = cg;
              data[i + 2] = cb;
            } else {
              data[i] = br;
              data[i + 1] = bg;
              data[i + 2] = bb;
            }
          }
          imageData.data.set(data, 0);
          /** ======= 设置颜色 end ====== */
          createImageBitmap(imageData).then((r) => {
            this.mainCtx.drawImage(r, 0, 0, this.mainWaveWidth, this.mainWaveHeight, 0, 0, this.mainWaveWidth, this.mainWaveHeight);
            if (this.isFirstUplod) {
              onDrawMainWaveFinish({ totalMs: this.totalMs });
              this.isFirstUplod = false;
            }
            resolve(true);
            // this.setState({ mainLoading: false });
          });
        }
      });
    });
  };

  // 绘制x轴
  drawXAxis = (startMs = 0) => {
    const { zoom } = this.state;
    const { gridFillColor, font, fillStyle, xAxisHeight, tickHeight, labelColor, tickCount } = waveConfig.xAxisConfig;
    // 根据tickCount（20）计算每个刻度显示的时间, 4k笔记本刻度: 11
    const smallTickCount = window.innerWidth <= 1600 ? 11 : tickCount;
    const xAxisMinMs = this.drawTotalMs / smallTickCount / (zoom / 100);
    this.xAxisCtx.font = font;
    this.xAxisCtx.fillStyle = fillStyle;
    this.xAxisCtx.fillRect(0, 0, this.mainWaveWidth, xAxisHeight);
    // 绘制1px的坐标轴
    waveUtil.drawOnePixelLineTo(this.xAxisCtx, 0, 1, this.mainWaveWidth, 1, gridFillColor);
    this.xAxisCtx.fillStyle = labelColor;
    const showMs = waveUtil.pxToMs(this.drawTotalMs, this.mainWaveWidth, this.mainWaveWidth * (zoom / 100), zoom);
    if (!xAxisMinMs) return;
    let even = true;
    for (let i = startMs; i <= showMs; i += xAxisMinMs) {
      const x = waveUtil.msToPx(this.drawTotalMs, this.mainWaveWidth, i - startMs, zoom);
      const showTickHeight = even ? tickHeight + 2 : tickHeight - 1;
      waveUtil.drawOnePixelLineTo(this.xAxisCtx, x, 1, x, showTickHeight, gridFillColor);
      // 显示时间格式处理
      const txt = waveUtil.secondsToMinutes(i);
      const fontWidth = this.xAxisCtx.measureText(txt).width;
      const posX = i === startMs ? 0 : fontWidth / 2; // 第一个时间左对齐
      even && this.xAxisCtx.fillText(txt, x - waveUtil.getNowHeight(posX), 20);
      even = !even;
    }
    this.xAxisStartMs = startMs;
  };

  // 绘制wave图的时间线
  drawTimeLine = (startX, clearnBg = true) => {
    const { lineWidth } = waveConfig.playLineConfig;
    const { lineColor } = this.isManual ? waveConfig.selectArea : waveConfig.smartSelectArea;
    const { Ystart } = waveConfig.mainWaveConfig;
    // 未点击播放时先绘制0位置的进度线;
    clearnBg && this.bgCtx.clearRect(0, 0, this.mainWaveWidth, this.mainWaveHeight);
    waveUtil.drawOnePixelLineTo(this.bgCtx, startX, Ystart, startX, this.mainWaveHeight, lineColor, lineWidth);
  };

  getMainHasMovedX = (currentScanX = this.currentScanStartX) => {
    return currentScanX / (this.scanSliderWidth / this.mainWaveWidth);
  };

  // 点击播放开始绘制
  drawPlay = () => {
    const { playing, zoom } = this.state;
    let playStartMs = this.audio.currentTime * 1000;
    const playEndMs = this.playList[this.playIndex].endTime;
    this.setState({ playCurrentTime: playStartMs });
    const playX = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, playStartMs, zoom);
    if (playStartMs >= playEndMs) {
      this.playIndex++;
      if (this.playIndex === this.playList.length) {
        this.pause();
        return;
      }
      playStartMs = this.playList[this.playIndex].startTime;
      this.audio.currentTime = playStartMs / 1000;
    }
    this.animationId = window.requestAnimationFrame(async () => {
      const hasMovedX = this.getMainHasMovedX();
      if (playX - hasMovedX > this.mainWaveWidth) {
        const startX = playX - this.mainWaveWidth;
        const scanHasMovedX = startX * (this.scanSliderWidth / this.mainWaveWidth);
        if (zoom !== 100) {
          this.drawScanSlider(scanHasMovedX);
        }
        const startMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, startX, this.state.zoom);
        this.drawXAxis(startMs);
        await this.drawMainWave(startMs);
      }
      this.drawMultiSelectArea();
      this.drawSelectArea(this.selectStartMs, this.selectEndMs, this.isManual, false);
      this.drawTimeLine(playX - hasMovedX, false);
      /** playStartMs 会先播放一次才判断,所以此处给个比0秒稍大的值, hasMovedX:判断大于0的任意值均可,代表有放大区域移动 */
      if (playStartMs < 2 && hasMovedX > 10) {
        this.drawScanSlider(0);
        this.drawXAxis(0);
        this.drawMainWave(0);
      }
      this.drawPlay();
      if (zoom !== 100) {
        this.drawSign();
      }
    });
  };

  play = () => {
    const playCurrentTime = this.initPlay();
    this.audio.currentTime = playCurrentTime / 1000;
    PubSub.publish('stopAllAudio');
    setTimeout(() => {
      const audioPromise = this.audio.play();
      this.bgCtx.clearRect(0, 0, this.mainWaveWidth, this.mainWaveHeight);
      audioPromise
        .then(() => {
          this.setState({ playing: true });
          this.drawPlay();
        })
        .catch((e) => {
          message.error(t('common:cannotPlay'));
        });
    }, 100);
  };

  initPlay = () => {
    let playList = this.signAll
      .filter(({ isVisible, isManual }) => isVisible && isManual === this.isManual)
      .map(({ startTime, endTime }) => ({ startTime, endTime }));
    if (this.selectStartMs !== this.selectEndMs) {
      playList.push({
        startTime: this.selectStartMs,
        endTime: this.selectEndMs
      });
    }
    playList = playList.sort((a, b) => a.startTime - b.startTime);
    const selectPlayIndex = playList.findIndex(({ startTime, endTime }) => this.selectStartMs > startTime && this.selectStartMs < endTime);
    this.playIndex = selectPlayIndex > -1 ? selectPlayIndex : 0;

    this.playList = playList.length ? playList : [{ startTime: 0, endTime: this.totalMs }];
    const playCurrentTime = playList.length ? this.playList[this.playIndex].startTime : this.state.playCurrentTime;
    return playCurrentTime;
  };

  pause = (playCurrentTime?: number) => {
    playCurrentTime = playCurrentTime || this.initPlay();
    this.audio?.pause();
    if (this.animationId) window.cancelAnimationFrame(this.animationId);
    this.setState({ playing: false, playCurrentTime });
  };

  /** 绘制选中区域 */
  drawSelectArea = (startTime: number, endTime: number, isManual: boolean, clearnBg = true, signCate?: number) => {
    const { signsColors } = this.props;
    const startScanX = (this.xAxisStartMs / this.totalMs) * this.mainWaveWidth;
    const mainHasMovedMs = this.getMainHasMovedX(startScanX) * this.actualPerPxMeamMs;
    startTime = startTime - mainHasMovedMs;
    endTime = endTime - mainHasMovedMs;
    const { lineWidth } = waveConfig.playLineConfig;
    const { Ystart } = waveConfig.mainWaveConfig;
    const { lineColor, backgroundColor } = isManual ? waveConfig.selectArea : waveConfig.smartSelectArea;
    clearnBg && this.bgCtx.clearRect(0, 0, this.mainWaveWidth, this.mainWaveHeight);
    const signBgColor = signsColors?.length && signCate ? signsColors[signCate % signsColors.length] : backgroundColor;
    this.bgCtx.fillStyle = signBgColor;
    const startX = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, startTime, this.state.zoom);
    const endX = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, endTime, this.state.zoom);
    if (startX) {
      waveUtil.drawOnePixelLineTo(this.bgCtx, startX, Ystart, startX, this.mainWaveHeight, lineColor, lineWidth);
    }
    if (endX) {
      waveUtil.drawOnePixelLineTo(this.bgCtx, endX, Ystart, endX, this.mainWaveHeight, lineColor, lineWidth);
    }
    this.bgCtx.fillRect(startX, 0, endX - startX, this.mainWaveHeight);

    isManual && this.drawScanSlider(startScanX, false);
  };

  /** 连续绘制多个区域 */
  drawMultiSelectArea = () => {
    this.bgCtx.clearRect(0, 0, this.mainWaveWidth, this.mainWaveHeight);
    this.signAll.forEach(({ isVisible, startTime, endTime, isManual, signCate }) => {
      isVisible && this.drawSelectArea(startTime, endTime, isManual, false, signCate);
    });
  };

  onBgDown = (e) => {
    e.persist();
    const { bgWaveRef } = this.domRefs;
    const { Global } = this.props;
    if (!bgWaveRef.current) return;
    this.isDrawing = true;
    const rect = e.target.getBoundingClientRect();
    const posPx = e.clientX - rect.left;
    const mainHasMovedMs = this.getMainHasMovedX() * this.actualPerPxMeamMs;
    this.selectStartMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, posPx, this.state.zoom) + mainHasMovedMs;
    Global.setRegion({
      ...Global.region,
      begin_time: this.selectStartMs
    });
    Global.setTotalMs(this.totalMs);
    window.addEventListener('mouseup', this.onBgUp);
    window.addEventListener('mousemove', this.onBgMove);
    this.pause();
  };

  onBgMove = (e) => {
    // const { Global } = this.props;
    const { bgWaveRef } = this.domRefs;
    if (!this.isDrawing || !bgWaveRef.current) return;
    const rect = bgWaveRef.current.getBoundingClientRect();

    const posLeftPx = e.clientX - rect.left;
    const mainHasMovedMs = this.getMainHasMovedX() * this.actualPerPxMeamMs;
    this.selectEndMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, posLeftPx, this.state.zoom) + mainHasMovedMs;
    const isInSelectArea = this.signAll.find(({ isVisible, startTime, endTime }) => isVisible && startTime <= this.selectEndMs && this.selectEndMs <= endTime);
    if (isInSelectArea) {
      this.isManual = isInSelectArea.isManual;
      this.drawMultiSelectArea();
      this.drawTimeLine(posLeftPx, false);
      this.selectStartMs = this.selectEndMs;
    } else {
      this.isManual = true;
      this.signAll.forEach((k) => (k.isVisible = false));
      this.drawSelectArea(this.selectStartMs, this.selectEndMs, this.isManual);
    }
  };

  onBgUp = (e) => {
    const { Global } = this.props;
    const { bgWaveRef } = this.domRefs;
    if (!bgWaveRef.current) return;
    const rect = bgWaveRef.current.getBoundingClientRect();
    this.onBgMove(e);
    this.isDrawing = false;
    if (this.selectStartMs > this.selectEndMs) {
      const temMs = this.selectStartMs;
      this.selectStartMs = this.selectEndMs;
      this.selectEndMs = temMs;
    }

    // 鼠标选区移出左边和右边的边界处理
    if (e.clientX <= rect.left) {
      this.selectStartMs = this.xAxisStartMs;
    } else if (e.clientX >= rect.right) {
      this.selectEndMs = this.xAxisStartMs + this.actualPerPxMeamMs * this.mainWaveWidth;
    }

    this.selectStartMs = Math.ceil(this.selectStartMs);
    this.selectEndMs = Math.ceil(this.selectEndMs);

    Global.setTotalMs(this.totalMs);
    Global.setRegion({ ...Global.region, begin_time: this.selectStartMs, end_time: this.selectEndMs });
    if (this.props.onSelectAreaChange) {
      this.props.onSelectAreaChange(this.selectStartMs, this.selectEndMs);
    }
    window.removeEventListener('mouseup', this.onBgUp);
    window.removeEventListener('mousemove', this.onBgMove);
  };

  onZoomRatioChange(value) {
    this.zoomChange('zoomIn', value);
  }

  onWheel = (event) => {
    let delta = 1;
    if (event.deltaY) {
      delta = event.deltaY > 0 ? 1 : -1;
    } else if (event.wheelDelta) {
      delta = -event.wheelDelta / 120;
    } else if (event.detail) {
      delta = event.detail > 0 ? 1 : -1;
    }
    if (!event.ctrlKey) return;
    if (delta > 0) {
      this.zoomChange('zoomOut');
    } else {
      this.zoomChange('zoomIn');
    }
  };

  getZoomStartMs() {
    const midMs = ((this.selectStartMs || this.xAxisStartMs) + (this.selectEndMs || this.xAxisStartMs + this.actualPerPxMeamMs * this.mainWaveWidth)) / 2;
    const waveWidthMs = this.actualPerPxMeamMs * this.mainWaveWidth;
    let startMS = midMs - waveWidthMs / 2;
    if (startMS < 0 || this.state.zoom === 100) {
      startMS = 0;
    }
    if (startMS + waveWidthMs > this.totalMs) {
      startMS = this.totalMs - waveWidthMs;
    }
    return startMS;
  }

  zoomChange = utils.throttle((type: 'zoomIn' | 'zoomOut', nowZoom?: number) => {
    if (!this.state.isValidFile) return;
    const { zoom } = this.state;
    const changeZoom = type === 'zoomIn' ? waveConfig.zoomStep : -waveConfig.zoomStep;
    nowZoom = nowZoom ? nowZoom : zoom + changeZoom;
    if (nowZoom < 100) nowZoom = 100;
    if (zoom === 100 && zoom === nowZoom) return;

    this.setState({ zoom: nowZoom, zoomRatio: `${nowZoom}%` }, () => {
      this.getWaveHead();
      this.mainCtx.clearRect(0, 0, this.mainWaveWidth, this.mainWaveHeight);
      const drawStartMs = this.getZoomStartMs();
      const startScanX = (this.xAxisStartMs / this.totalMs) * this.mainWaveWidth;
      /* 如果是全选从0开始缩放 */
      const startXMs = this.selectStartMs === 0 && this.selectEndMs === this.totalMs ? 0 : drawStartMs;

      this.drawMainWave(startXMs);
      this.xAxisCtx.clearRect(0, 0, this.mainWaveWidth, waveConfig.xAxisConfig.xAxisHeight);
      this.drawXAxis(startXMs);
      this.drawScanSlider(startScanX, true);
      this.drawMultiSelectArea();
      this.drawSelectArea(this.selectStartMs, this.selectEndMs, true, false);
      this.drawSign();
    });
  });

  signClick = (e, isManual = true) => {
    this.isManual = isManual;
    const rect = e.target.getBoundingClientRect();
    const posPx = e.clientX - rect.left;
    const mainHasMovedMs = this.getMainHasMovedX() * this.actualPerPxMeamMs;
    const posMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, posPx, this.state.zoom) + mainHasMovedMs;
    this.selectStartMs = 0;
    this.selectEndMs = 0;
    this.signAll.forEach((item) => {
      const { startTime, endTime, isManual } = item;
      if (startTime <= posMs && posMs <= endTime && this.isManual !== isManual) {
        item.isVisible = false;
      }
    });
    this.drawSign(posMs, isManual);
  };

  /** 绘制标注 */
  drawSign = (activeTime?: number, isActive?: boolean) => {
    const { zoom, smartSignVisible, signVisible } = this.state;
    const { signsColors } = this.props;
    this.signCtx.clearRect(0, 0, this.mainWaveWidth, waveConfig.signConfig.height);
    this.smartSignCtx?.clearRect(0, 0, this.mainWaveWidth, waveConfig.smartSignConfig.height);
    this.signAll.forEach((item) => {
      const { name, startTime, endTime, isManual } = item;
      const totalStartX = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, startTime, zoom);
      const totalEndX = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, endTime, zoom);
      const startX = totalStartX - this.getMainHasMovedX();
      const endX = totalEndX - this.getMainHasMovedX();
      const { color, backgroundColor, height } = isManual ? waveConfig.signConfig : waveConfig.smartSignConfig;
      if (isManual && signVisible) {
        this.signCtx.fillStyle = color;
        const pox = (endX + startX) / 2 - waveUtil.getNowHeight(this.signCtx.measureText(name).width / 2);
        this.signCtx.fillText(name, pox, 20);
        this.signCtx.fillStyle = backgroundColor;
        this.signCtx.fillRect(startX, 0, endX - startX, height);
        if (activeTime && startTime <= activeTime && activeTime <= endTime && isActive === isManual) {
          item.isVisible = !item.isVisible;
          this.pause();
          this.drawMultiSelectArea();
        }
      } else if (!isManual && smartSignVisible && this.smartSignCtx) {
        this.smartSignCtx.fillStyle = color;
        const pox = (endX + startX) / 2 - waveUtil.getNowHeight(this.smartSignCtx.measureText(name).width / 2);
        this.smartSignCtx.fillText(name, pox, 20);
        const signBgColor = signsColors?.length && item.signCate ? signsColors[item.signCate % signsColors.length] : backgroundColor;
        this.smartSignCtx.fillStyle = signBgColor;
        this.smartSignCtx.fillRect(startX, 0, endX - startX, height);
        if (activeTime && startTime <= activeTime && activeTime <= endTime && isActive === isManual) {
          item.isVisible = !item.isVisible;
          this.pause();
          this.drawMultiSelectArea();
        }
      }
    });
  };

  drawSignIcon = () => {
    const spec = document.createElement('img');
    spec.src = atlas_stop;
    this.smartSignCtx.drawImage(spec, 10, 9, 12, 12);
  };

  /** 添加标注 */
  addSign = (signItem: SignProps) => {
    const hasSameName = this.signAll.some((k) => k.name === signItem.name);
    if (hasSameName) {
      message.error({ content: t('common:repeatSignName'), duration: 1 });
      return false;
    }
    const hasSameTimeArea = (isManual) => {
      return this.signAll.some((k) => {
        if (k.isManual === isManual && k.startTime <= signItem.startTime && signItem.startTime <= k.endTime) {
          return true;
        }
        return false;
      });
    };
    if (hasSameTimeArea(true)) {
      message.error({ content: t('common:hasSigned'), duration: 1 });
      return false;
    }
    signItem.id = uuidv4();
    signItem.isManual = true;
    signItem.isVisible = !hasSameTimeArea(false);
    this.signAll.unshift(signItem);
    this.drawSign();
    const manualSigns = this.signAll.filter((item) => item.isManual === true);
    this.setState({ manualSigns });
    message.success({ content: t('common:addSignSucc'), duration: 1 });
    return true;
  };

  /** 编辑标注 */
  editSign = (signItem: SignProps) => {
    const hasSameName = this.signAll.some((k) => k.isManual === signItem.isManual && k.name === signItem.name);
    if (hasSameName) {
      message.error({ content: t('common:repeatSignName'), duration: 1 });
      return false;
    }
    const idx = this.signAll.findIndex((k) => k.id === signItem.id);
    if (idx > -1) {
      this.signAll[idx] = signItem;
      const manualSigns = this.signAll.filter((item) => item.isManual === true);
      this.setState({ manualSigns });
    }
    this.drawSign();
    message.success({ content: t('common:editSignSucc'), duration: 1 });
    return true;
  };

  /** 删除标注 */
  deleteSign = (id: SignProps['id']) => {
    const idx = this.signAll.findIndex((k) => k.id === id);
    if (idx > -1) {
      this.signAll.splice(idx, 1);
    }
    this.drawSign();
    this.drawMultiSelectArea();
    this.setState({ manualSigns: this.signAll });
  };

  onAddSign = () => {
    const { onClickAddSign = noop } = this.props;
    if ((!this.selectStartMs && !this.selectEndMs) || this.selectEndMs === this.selectStartMs) {
      message.error(t('common:signPla'));
      return;
    }
    onClickAddSign();
  };

  /** 恢复标注 */
  recoverySign = (item: SignProps) => {
    if (item) this.signAll.push(item);
    this.drawSign();
    this.drawMultiSelectArea();
  };

  onSliderDown = (e) => {
    const { scanSliderRef } = this.domRefs;
    if (!scanSliderRef.current) return;
    const rect = e.target.getBoundingClientRect();
    this.scanStartX = e.clientX - rect.left;
    scanSliderRef.current.style.cursor = '-webkit-grab';
    window.addEventListener('mouseup', this.onSliderUp);
    window.addEventListener('mousemove', this.onSliderMove);
  };

  onSliderMove = (e) => {
    const { scanSliderRef } = this.domRefs;
    if (!scanSliderRef.current) return;
    const scanRect = scanSliderRef.current.getBoundingClientRect();
    let posX = 0;
    if (e.target) {
      const rect = e.target.getBoundingClientRect();
      posX = e.clientX - rect.left;
    } else {
      posX = e;
    }
    // 鼠标移除左侧区域
    if (e.clientX < scanRect.left) return;
    scanSliderRef.current.style.cursor = '-webkit-grab';

    let currentScanX = this.prevScanStartX + posX - this.scanStartX;
    const mainHasMovedX = this.getMainHasMovedX(currentScanX);
    let startMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, mainHasMovedX, this.state.zoom);
    const totalMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, mainHasMovedX + this.mainWaveWidth, this.state.zoom);
    this.drawMultiSelectArea();
    this.drawSelectArea(this.selectStartMs, this.selectEndMs, true, false);
    if (currentScanX < 10) {
      currentScanX = 0;
      startMs = 0;
    }

    if (totalMs > this.totalMs - 10) {
      const zoonWidth = this.mainWaveWidth / (this.state.zoom / 100);
      currentScanX = this.mainWaveWidth - zoonWidth;
      const mainHasMovedX = this.getMainHasMovedX(currentScanX);
      startMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, mainHasMovedX, this.state.zoom);
    }

    this.drawSign();
    this.drawXAxis(startMs);
    this.updateMainWave(startMs);
    this.drawScanSlider(currentScanX, false);
    if (!e.target) {
      this.prevScanStartX = this.currentScanStartX;
    }
  };

  /** 下一次重绘更新图谱 */
  updateMainWave = utils.throttle((startMs) => {
    requestAnimationFrame(() => {
      this.drawMainWave(startMs);
    });
  }, 200);

  onSliderUp = (e) => {
    const { scanSliderRef } = this.domRefs;
    if (!scanSliderRef.current) return;
    scanSliderRef.current.style.cursor = 'default';
    window.removeEventListener('mouseup', this.onSliderUp);
    window.removeEventListener('mousemove', this.onSliderMove);
    this.prevScanStartX = this.currentScanStartX;
  };

  signDoubleClick = (e, isManual = true) => {
    const rect = e.target.getBoundingClientRect();
    const posPx = e.clientX - rect.left;
    const mainHasMovedMs = this.getMainHasMovedX() * this.actualPerPxMeamMs;
    const activeTime = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, posPx, this.state.zoom) + mainHasMovedMs;
    const { onDoubleClickSign = noop, onDoubleClickSmartSign = noop } = this.props;
    this.signAll.forEach((item) => {
      if (activeTime && item.startTime <= activeTime && activeTime <= item.endTime) {
        if (isManual) {
          onDoubleClickSign(item);
        } else {
          onDoubleClickSmartSign(item);
        }
      }
    });
  };

  toggleSmartSign = () => {
    this.setState(
      (prevState) => ({
        smartSignVisible: !prevState.smartSignVisible
      }),
      () => {
        this.signAll.forEach((k) => (!k.isManual ? (k.isVisible = this.state.smartSignVisible) : k));
        this.drawSign();
        this.drawMultiSelectArea();
      }
    );
  };

  toggleSign = () => {
    this.setState(
      (prevState) => ({
        signVisible: !prevState.signVisible
      }),
      () => {
        this.signAll.forEach((k) => (k.isManual ? (k.isVisible = this.state.signVisible) : k));
        this.drawSign();
        this.drawMultiSelectArea();
      }
    );
  };

  reDraw = () => {
    this.getWaveHead();
    this.drawMainWave(this.xAxisStartMs);
    this.drawWaveScan();
    this.drawXAxis(this.xAxisStartMs);
  };

  waveSaveTmp = () => {
    const tempFilePath = path.join(Reflect.get($$, 'tempFiles'), `tmp.wav`);
    waveGraph.saveEdit(this.waveId, tempFilePath, (res) => {
      if (res) {
        this.audio.src = `file:\\\\\\${tempFilePath}`;
        this.audio.playbackRate = this.state.playbackRate.value;
      }
    });
  };

  waveAction = utils.debounce((receiveParams) => {
    console.log('receiveParams', receiveParams);
    const { type, name = 'test', activeFileId } = receiveParams;
    const { Global, fileId } = this.props;
    const { copyByteSizeLimit } = waveConfig;
    const positon = this.selectStartMs;
    const size = this.selectEndMs - this.selectStartMs;
    const selectByteSize = (size / this.totalMs) * this.pcmSize;
    if (selectByteSize > copyByteSizeLimit) {
      message.warning(t('common:editAreaLimit'));
      return;
    }
    switch (type) {
      case 'wave_all': {
        this.selectStartMs = 0;
        this.selectEndMs = this.totalMs;
        this.drawSelectArea(0, this.totalMs, true, true);
        Global.setRegion({ begin_time: 0, end_time: this.totalMs });
        break;
      }
      // case 'wave_all_no': {
      //   this.selectStartMs = 0;
      //   this.selectEndMs = 0;
      //   this.drawSelectArea(0, 0, true);
      //   Global.setRegion({ begin_time: 0, end_time: 0 });
      //   break;
      // }
      case 'wave_space': {
        const { playCurrentTime, playing } = this.state;
        if (playing) {
          this.pause(playCurrentTime);
        } else {
          PubSub.publishSync('stopAllAudio');
          this.play();
        }
        break;
      }
      case 'wave_cut': {
        if (!size) return;
        const cutData: Buffer | Uint8Array = waveGraph.getData(this.waveId, this.selectStartMs, this.selectEndMs);
        Global.setCacheWaveData({ orignFileId: fileId, orignWaveId: this.waveId, originBufMs: size, orignCutBuf: cutData });
        const waveCutParams: WaveEditParam = { type: 'delete', positon, size };
        waveGraph.editWave(this.waveId, waveCutParams, (res: WaveEditResult) => {
          if (res.ok) {
            // 坐标轴展示的总时间长度需要同步变化
            this.setState({ hasEdit: true });
            this.reDraw();
            this.updateWave();
            this.onDeleteAreas(this.selectStartMs, this.selectEndMs);
            // 取消选中区间
            this.selectEndMs = this.selectStartMs;
            this.drawSelectArea(this.selectStartMs, this.selectEndMs, true);
          }
        });
        break;
      }
      case 'wave_copy': {
        if (!size) return;
        const copyData: Buffer | Uint8Array = waveGraph.getData(this.waveId, this.selectStartMs, this.selectEndMs);
        Global.setCacheWaveData({ orignFileId: fileId, orignWaveId: this.waveId, originBufMs: size, orignCutBuf: copyData });
        message.success(t('common:copySucc'));
        break;
      }
      case 'wave_paste': {
        const copyBuf = toJS(Global.waveCacheData.orignCutBuf);
        const copyBufMs = toJS(Global.waveCacheData.originBufMs);
        if (!copyBufMs) return;
        const waveInsertParams: WaveEditParam = { type: 'insert', positon, size: copyBufMs, data: copyBuf };
        waveGraph.editWave(this.waveId, waveInsertParams, (res: WaveEditResult) => {
          if (res.ok) {
            this.selectStartMs = positon;
            this.selectEndMs = positon + copyBufMs;
            this.reDraw();
            this.setState({ hasEdit: true });
            this.updateWave();
            this.onAddAreas(positon, copyBufMs);
            this.drawSelectArea(positon, positon + copyBufMs, true);
            // Global.setCacheWaveData({});
          }
        });
        break;
      }
      case 'wave_clear': {
        if (!size) return;
        const waveClearParams: WaveEditParam = { type: 'clear', positon, size };
        waveGraph.editWave(this.waveId, waveClearParams, (res: WaveEditResult) => {
          if (res.ok) {
            this.reDraw();
            this.setState({ hasEdit: true });
            this.updateWave();
            Global.setCacheWaveData({});
          }
        });
        break;
      }
      case 'wave_delete': {
        if (!size) return;
        const waveDeleteParams: WaveEditParam = { type: 'delete', positon, size };
        waveGraph.editWave(this.waveId, waveDeleteParams, (res: WaveEditResult) => {
          if (res.ok) {
            this.reDraw();
            this.setState({ hasEdit: true });
            this.updateWave();
            Global.setCacheWaveData({});
            this.onDeleteAreas(this.selectStartMs, this.selectEndMs);
            this.selectEndMs = this.selectStartMs;
            this.drawSelectArea(this.selectStartMs, this.selectEndMs, true);
          }
        });
        break;
      }
      case 'wave_save': {
        if (!this.state.hasEdit) {
          message.warning(t('common:noNeedSave'));
          return;
        }
        const tempFilePath = path.join(Reflect.get($$, 'tempFiles'), `${Date.now()}.wav`);
        this.setState({ mainLoading: true });
        waveGraph.saveEdit(this.waveId, tempFilePath, (res) => {
          if (res) {
            PubSub.publish(AppEventNames.REFRESH_UPLOAD_LIST, { filePaths: [tempFilePath] });
            this.setState({ mainLoading: false });
          }
        });
        break;
      }
      case 'wave_undo': {
        if (this.waveId < 0 || this.operationRecord.length === 0) return;
        waveGraph.undoEdit(this.waveId, (res: WaveUndoResult) => {
          if (res.ok) {
            this.setState({ hasEdit: res.index > 0 });
            this.reDraw();
            this.updateWave();
            Global.setCacheWaveData({});

            /** 1.获取最近一次操作记录 */
            const { deleteSigns, startTime, endTime, changeTimeIds, editType } = this.operationRecord.pop() as DeleteSignsType;
            /** 2.标记恢复 */
            deleteSigns?.forEach((sign) => {
              sign && this.recoverySign(sign);
            });
            /** 3.标记恢复后, 处理需要累加时间的标记 */
            const regionTime = endTime - startTime;
            this.signAll.forEach((item) => {
              if (changeTimeIds.includes(item.id as string)) {
                if (editType === 'sub') {
                  item.startTime = item.startTime + regionTime;
                  item.endTime = item.endTime + regionTime;
                } else if (editType === 'add') {
                  item.startTime = item.startTime - regionTime;
                  item.endTime = item.endTime - regionTime;
                }
              }
            });
            this.drawSign();
          }
        });
        break;
      }
      case 'wave_right': {
        this.scanStartX = 0;
        this.onSliderMove(10);
        break;
      }
      case 'wave_left': {
        this.scanStartX = 0;
        this.onSliderMove(-10);
        break;
      }

      case 'wave_addSign': {
        const addSignParams = { startTime: this.selectStartMs, isManual: true, endTime: this.selectEndMs, name };
        this.addSign(addSignParams);
        break;
      }
      case 'wave_editSign': {
        this.editSign(receiveParams);
        break;
      }
      case 'deleteSign': {
        this.deleteSign(activeFileId);
        break;
      }

      default:
        break;
    }
  }, 30);

  /** 更新音频buffer */
  updateWave = () => {
    const waveHead = waveGraph.getPCMInfo(this.waveId);
    const int8: Buffer | Uint8Array = waveGraph.getData(this.waveId, 0, waveHead.Duration);
    const buff = waveUtil.getWavBuffer(int8, waveHead.SampleRate, waveHead.Channels);
    this.filePath && window.URL.revokeObjectURL(this.filePath);
    this.filePath = window.URL.createObjectURL(new Blob([buff]));
    this.audio.src = this.filePath;
  };

  /** 记录图谱粘贴 */
  onAddAreas = (selectStartTime: number, selectEndTime: number) => {
    /** 记录删除的标记 */
    const deleteSigns: SignProps[] = [];
    /** 记录删除区域需要减去时长的标记id */
    const changeTimeIds: string[] = [];
    const regionTime = selectEndTime - selectStartTime;

    this.signAll.forEach((item) => {
      if (selectStartTime > item.startTime && selectStartTime < item.endTime) {
        deleteSigns.push(item);
      }
      if (selectStartTime <= item.startTime && selectStartTime < item.endTime) {
        item.startTime = item.startTime + regionTime;
        item.endTime = item.endTime + regionTime;
        item.id && changeTimeIds.push(item.id);
      }
    });
    deleteSigns.forEach((item) => {
      this.deleteSign(item.id);
    });
    this.operationRecord.push({ deleteSigns, startTime: selectStartTime, endTime: selectEndTime, changeTimeIds, editType: 'add' });
    this.drawSign();
  };

  /** 记录图谱剪切和删除 */
  onDeleteAreas = (selectStartTime: number, selectEndTime: number) => {
    /** 记录删除的标记 */
    const deleteSigns: SignProps[] = [];
    /** 记录删除区域需要减去时长的标记id */
    const changeTimeIds: string[] = [];
    const regionTime = selectEndTime - selectStartTime;

    this.signAll.forEach((item) => {
      if (
        (selectStartTime <= item.startTime && selectEndTime >= item.endTime) ||
        (selectStartTime < item.endTime && selectStartTime >= item.startTime) ||
        (selectEndTime > item.startTime && selectEndTime <= item.endTime)
      ) {
        deleteSigns.push(item);
      }
      if (selectStartTime <= item.startTime && selectEndTime <= item.startTime) {
        item.startTime = item.startTime - regionTime;
        item.endTime = item.endTime - regionTime;
        item.id && changeTimeIds.push(item.id);
      }
    });
    deleteSigns.forEach((item) => {
      this.deleteSign(item.id);
    });
    this.operationRecord.push({ deleteSigns, startTime: selectStartTime, endTime: selectEndTime, changeTimeIds, editType: 'sub' });
    this.drawSign();
  };

  getManualSign() {
    const dataSource = this.signAll.filter((item) => item.isManual === true);
    return dataSource;
  }

  /** 音频操作 */
  voiceHandler() {
    const inputPath = this.filePath;
    const outPath = path.join(process.cwd(), '/public/assets/video/16_long_bak.wav');
    const sampleRate = 16000;
    const sOut = sampleObj[sampleRate];
    const startTime = utils.toHHmmss(this.selectStartMs).split('.')[0];
    const endTime = utils.toHHmmss(this.selectEndMs).split('.')[0];

    // const spawnCmd: any = ['-f', `${sOut}`, '-ar', `${sampleRate}`, '-ac', '1', '-y', '-i', inputPath, outPath];
    const spawnCmd: any = ['-f', `${sOut}`, '-ar', `${sampleRate}`, '-ac', '1', '-y', '-ss', startTime, '-t', endTime, '-i', inputPath, outPath];
    console.log('spawnCmd', spawnCmd);

    execFfmpeg(spawnCmd)
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => console.log('err', err));
  }

  /** 获取文件流存本地 */
  // getFilePath() {
  //   // const int8 = new Uint8Array(res, 2);
  //   const filePath = path.join(process.cwd(), '/public/assets/video/16k.wav');
  //   const int8 = readFile(filePath);
  //   if (!int8) return;
  //   const { inputPath, outPath } = saveFfmpeg({ name: 'test.wav', int8, sampleRate: 1600, channels: 1 });
  //   console.log(' inputPath, outPath', inputPath, outPath);
  // }

  render() {
    const { scanWaveRef, bgWaveRef, mainWaveRef, clientRef, xAxisRef, yAxisRef, scanSliderRef, signRef, smartSignRef } = this.domRefs;
    const {
      playing,
      playCurrentTime,
      signVisible,
      smartSignVisible,
      manualSigns,
      smartSignListVisible,
      manualSignListVisible,
      mainLoading,
      scanLoading,
      isValidFile,
      zoomRatio
    } = this.state;
    const {
      onDoubleClickSign,
      showAddBtn = true,
      showSmartSign = true,
      showManualSign = true,
      showSelectArea = true,
      smartSignTitle,
      isSearchVoiceSign
    } = this.props;
    return isValidFile ? (
      <div
        className="wave"
        onClick={() => {
          Mousetrap.unbind('space');
          Mousetrap.bind('space', (e: KeyboardEvent) => {
            e.preventDefault();
            this.waveAction({ type: 'wave_space' });
          });
        }}
      >
        <Button onClick={this.voiceHandler.bind(this)} type="primary" style={{ width: 50 }}>
          保存
        </Button>
        <div className="wave-graph">
          <div className="flex">
            <div className="ui-h-100" style={{ width: this.yAxisWidth }}>
              <canvas className="ui-h-100" ref={yAxisRef}></canvas>
            </div>
            <div className="flex-1 ui-ov-h">
              <div className="wave-head">
                <canvas ref={scanWaveRef} className="wave-head-scan"></canvas>
                <canvas ref={scanSliderRef} onMouseDown={this.onSliderDown} className="wave-scan-slider"></canvas>
              </div>

              <div className="wave-content flex" ref={clientRef}>
                <div>
                  <canvas className="wave-content-bg ui-h-100" ref={bgWaveRef} onWheel={this.onWheel} onMouseDown={this.onBgDown} />
                  {/* <Spin spinning={mainLoading || scanLoading} style={{ height: '100%' }}></Spin> */}
                  <canvas className="ui-h-100 flex-1" ref={mainWaveRef} style={{ cursor: 'text' }} />
                </div>
                <canvas className="wave-xAxis" ref={xAxisRef}></canvas>
              </div>
            </div>
          </div>

          <div className="sign-area">
            {/* 智能标注 */}
            {showSmartSign ? (
              <div style={{ position: 'relative', height: showSmartSign ? '32px' : 0 }}>
                <canvas
                  ref={smartSignRef}
                  className="sign-area-bg"
                  style={{ cursor: 'text' }}
                  title={t('common:lookMore')}
                  onClick={(e) => this.signClick(e, false)}
                  onDoubleClick={(e) => this.signDoubleClick(e, false)}
                />
                <div className="sign-img-contain">
                  {smartSignTitle ? (
                    <span>{smartSignTitle}</span>
                  ) : (
                    <>
                      {t('common:autoSign')}
                      <img src={atlas_label} className="smart_img" title={t('common:autoSign')} alt={t('common:autoSign')} />
                    </>
                  )}
                </div>
                <Popover
                  trigger="click"
                  placement="left"
                  overlayClassName="sign_modal"
                  visible={smartSignListVisible}
                  getPopupContainer={() => document.querySelector('.wave-bottom') as HTMLElement}
                  onVisibleChange={(visible) => this.setState({ smartSignListVisible: visible })}
                  title={
                    <div className="flex just-between">
                      <div>{`${t('common:sign')}（${this.signAll?.length}）`}</div>
                      <div
                        className="cursor fz20"
                        title={t('common:close')}
                        style={{ lineHeight: '14px' }}
                        onClick={() => this.setState({ smartSignListVisible: false })}
                      >
                        ×
                      </div>
                    </div>
                  }
                  content={() => <SignTable isSearchVoiceSign={isSearchVoiceSign} dataSource={this.signAll.filter((item) => !item.isManual)} />}
                >
                  <img
                    src={smartSignListVisible ? more_signclose : more_signopen}
                    className="sign_collapsed"
                    title={smartSignListVisible ? t('common:hideSignList') : t('common:showSignList')}
                    alt={t('common:sign')}
                    onClick={() => {
                      this.setState({ manualSignListVisible: false });
                      this.setState({ smartSignListVisible: !smartSignListVisible });
                    }}
                  />
                </Popover>
                <img
                  src={smartSignVisible ? atlas_eyesopen : atlas_eyesclose}
                  className="visible_img"
                  title={smartSignVisible ? t('common:showAutoSign') : t('common:hideAutoSign')}
                  alt={t('common:hide')}
                  onClick={this.toggleSmartSign}
                />
                <div className="border" />
              </div>
            ) : null}

            {/* 手动标注 */}
            <div style={{ position: 'relative', display: showManualSign ? 'block' : 'none', height: showManualSign ? '32px' : 0 }}>
              <canvas onDoubleClick={this.signDoubleClick} onClick={this.signClick} className="sign-area-bg shou" ref={signRef} />
              <img
                src={signVisible ? atlas_eyesopen : atlas_eyesclose}
                className="visible_img"
                title={signVisible ? t('common:show') : t('common:hide')}
                alt={t('common:hide')}
                onClick={this.toggleSign}
              />
              <Popover
                trigger="click"
                placement="left"
                style={{ zIndex: 2 }}
                overlayClassName="sign_modal"
                visible={manualSignListVisible}
                onVisibleChange={(visible) => this.setState({ manualSignListVisible: this.props.Global?.showSignEdit || visible })}
                getPopupContainer={(node) => document.querySelector('.wave-bottom') as HTMLElement}
                title={
                  <div className="flex just-between">
                    <div>{`${t('common:sign')}（${manualSigns?.length}）`}</div>
                    <div
                      className="cursor fz20"
                      title={t('common:close')}
                      style={{ lineHeight: '14px' }}
                      onClick={() => this.setState({ manualSignListVisible: false })}
                    >
                      ×
                    </div>
                  </div>
                }
                content={() => <SignTable dataSource={[...manualSigns]} onEditSign={onDoubleClickSign} />}
              >
                <img
                  src={manualSignListVisible ? more_signclose : more_signopen}
                  className="sign_collapsed"
                  title={manualSignListVisible ? t('common:hideSignList') : t('common:showSignList')}
                  alt="标记"
                  onClick={() => {
                    this.setState({ smartSignListVisible: false });
                    this.setState({ manualSignListVisible: !manualSignListVisible });
                  }}
                />
              </Popover>
            </div>
          </div>
        </div>

        <div className="wave-bottom">
          <div className="play-area">
            <span className="current-time ellipsis">
              {/* {waveUtil.secondsToMinutes(playCurrentTime)} */}
              {showSelectArea ? (
                <span className="mr20">
                  {t('common:selectArea')}&nbsp;
                  {utils.toHHmmss(this.selectStartMs)}-{utils.toHHmmss(this.selectEndMs)}
                </span>
              ) : null}
              <span>
                {t('common:time')}&nbsp;
                {utils.toHHmmss(this.totalMs)}
              </span>
            </span>
            <div className="play-action word-nowrap">
              {playing ? (
                <img src={atlas_stop} className="operate_img" title={t('common:pause')} alt={t('common:pause')} onClick={() => this.pause(playCurrentTime)} />
              ) : (
                <img src={atlas_play} className="operate_img" title={t('common:play')} alt={t('common:play')} onClick={() => this.play()} />
              )}
              {showAddBtn ? (
                <img src={atlas_sign} className="operate_img ui-ml-10" title={t('common:addSign')} alt={t('common:addSign')} onClick={this.onAddSign} />
              ) : null}
              <div onClick={(e) => e.stopPropagation()} style={{ display: 'inline-block' }}>
                <Popover
                  trigger="focus"
                  visible={this.state.playbackRateVisible}
                  overlayClassName="playbackRates"
                  getPopupContainer={(node) => node.parentNode as HTMLElement}
                  onVisibleChange={(visible) => this.setState({ playbackRateVisible: visible })}
                  content={
                    <div>
                      {waveConfig.playbackRates.map((item) => {
                        return (
                          <div
                            className="play_back_rate cursor"
                            key={item.label}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              this.audio.playbackRate = item.value;
                              this.setState({ playbackRate: item, playbackRateVisible: false });
                              return;
                            }}
                          >
                            <span className="content">{item.value === 1 ? `${item.label} (正常)` : item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  }
                >
                  <Button size="small" className="play_backRate_btn">
                    {this.state.playbackRate.label}
                  </Button>
                </Popover>
              </div>
            </div>
            <div className="zoom-area">
              <img src={atlas_big} className="operate_img" title={t('common:zoomIn')} alt={t('common:zoomIn')} onClick={() => this.zoomChange('zoomIn')} />
              <img
                src={atlas_sma}
                className="operate_img ui-ml-10"
                title={t('common:zoomOut')}
                alt={t('common:zoomOut')}
                onClick={() => this.zoomChange('zoomOut')}
              />
              <Select value={zoomRatio} onChange={this.onZoomRatioChange.bind(this)} className="scale-select" size="small" style={{ width: 80 }}>
                {waveConfig.zoomRatios.map((item) => (
                  <Select.Option value={item.value} key={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .wave {
              display: flex;
              flex-direction: column;
              overflow: hidden;
              width: 100%;
              background: #202020;
              border: 1px solid #3f4041;
              border-radius: 4px;
              padding: 8px;
            }
            .wave-graph {
              background: #171717;
              border: 1px solid #000000;
            }
            .wave-head {
              width: 100%;
              height: 28px;
              position: relative;
            }
            .wave-scan-slider {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 2;
            }
            .wave-head-scan {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }
            .wave-content {
              position: relative;
              height: 100%;
              width: 100%;
              flex: 1;
            }
            .wave-content-bg {
              position: absolute;
              width: 100%;
              top: 0;
              left: 0;
              z-index: 1;
            }
            .wave-bottom {
              width: 100%;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .wave-xAxis {
              height: 25px;
            }
            .sign-area {
              width: 100%;
              line-height: 0;
              position: relative;
            }

            .sign-list {
              background: #202020;
              border: 1px solid #000000;
            }
            .play-area {
              margin-top: 8px;
              height: 26px;
              display: flex;
              width: 100%;
              align-items: center;
              color: var(--color_main);
              font-size: 14px;
              justify-content: space-between;
            }
            .current-time {
              width: 100%;
              max-width: 360px;
            }
            .zoom-area {
              width: 360px;
              text-align: right;
              padding-right: 20px;
            }
            .play-action {
              text-align: center;
            }
            .operate_img {
              width: 18px;
              height: 18px;
              cursor: pointer;
            }
            .visible_img {
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
            .sign_collapsed {
              width: 14px;
              height: 14px;
              cursor: pointer;
              position: absolute;
              right: 16px;
              top: 8px;
            }

            .sign-img-contain {
              position: absolute;
              left: 4px;
              top: 50%;
              display: flex;
              align-items: center;
              transform: translateY(-50%);
            }
            .smart_img {
              margin-left: 5px;
              width: 14px;
              height: 14px;
            }
          `}
        </style>
      </div>
    ) : (
      <div className="ui-w-100 ui-h-100 flex just-center align-center" style={{ border: '1px solid #0f2757', minHeight: 160 }}>
        <span>暂不支持播放</span>
      </div>
    );
  }
}

export default Wave;
