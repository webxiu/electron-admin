import { Button, Popover, Select, Spin, message } from 'antd';
import React, { Component, createRef } from 'react';
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
import i18next from 'i18next';
import more_signclose from '@/Render/assets/img/wave/more_signclose.png';
import more_signopen from '@/Render/assets/img/wave/more_signopen.png';
import path from 'path';
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
  zoomRatios: { label: string; value: number }[];
  playbackRates: { label: string; value: number }[];
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
  /** 是否为Tab加载,Tab有多个音频时,窗口放大只加载当前选中图谱 */
  isResultReload: boolean;
  /** 是否显示选区时间 */
  showSelectArea?: boolean;
  /** 智能标注区域的标注标题 */
  smartSignTitle?: string;
  /** 是否为以音搜音图谱(用于标注折叠表格配置) */
  isSearchVoiceSign?: boolean;
  /** 是否为以音搜音图谱(用于标注折叠表格配置) */
  onZoomChange?: (zoom: number) => void;
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
  playbackRates: { label: string; value: number };
  /** 是否为合法文件 */
  isValidFile: boolean;
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
    zoom: 100,
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
    playbackRates: waveConfig.playbackRates[2],
    isValidFile: true
  };
  filePath = this.props.filePath || '';
  subToken = '';
  fileId = 0;
  pcmSize = 0; // 总字节数
  Maximize = false;
  isFirstUplod = true;
  yAxisWidth = 30;

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

    /** WAVE_ACTION 处理波形图 根据fileId订阅唯一的事件名称 */
    const waveActionName = `WAVE_ACTION_${this.props.fileId}`;
    PubSub.subscribe(`${waveActionName}`, (msg: string, data) => {
      if (msg === waveActionName) {
        this.waveAction(data);
      }
    });
  }

  componentWillUnmount() {
    this.pause();
    waveGraph.releaseDraw(this.waveId);
    window.removeEventListener('resize', this.handleResize);
    PubSub.unsubscribe(this.subToken);
    PubSub.unsubscribe(`WAVE_ACTION_${this.props.fileId}`);
    cacheWaveId = {};
    Mousetrap.unbind('space');
  }

  resize = () => {
    if (!this.state.isValidFile) return;
    this.Maximize = true;
    const { fileId, activeFileId, isResultReload } = this.props;
    if (isResultReload) {
      if (activeFileId && fileId === Number(activeFileId)) {
        this.initCanvas();
        this.reDraw();
        this.drawSign();
        this.drawMultiSelectArea();
      }
    } else {
      this.initCanvas();
      this.reDraw();
      this.drawSign();
      this.drawMultiSelectArea();
      if (this.selectStartMs > 0 && this.selectEndMs > 0) {
        this.drawSelectArea(this.selectStartMs, this.selectEndMs, true);
      }
    }
  };

  componentDidUpdate(prevProps: TProps, prevState: TState) {
    const { fileId, activeFileId, isResultReload } = this.props;
    if (!this.state.isValidFile) return;
    if (prevProps.activeFileId === activeFileId) {
      return;
    }
    if (isResultReload && this.Maximize) {
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
    const { scanMask, waveScanHeight } = waveConfig;
    this.scanSliderWidth = this.mainWaveWidth / (zoom / 100);
    if (setPrevStartX) this.prevScanStartX = startX;
    this.currentScanStartX = startX;
    this.scanSliderCtx.clearRect(0, 0, this.mainWaveWidth, waveScanHeight);
    this.scanSliderCtx.strokeStyle = scanMask.borderColor;
    this.scanSliderCtx.fillStyle = scanMask.backgroundColor;
    this.scanSliderCtx.lineWidth = 1;
    this.scanSliderCtx.fillRect(startX, 0, this.scanSliderWidth, waveScanHeight);
    this.scanSliderCtx.strokeRect(
      startX + this.scanSliderCtx.lineWidth,
      this.scanSliderCtx.lineWidth,
      this.scanSliderWidth - this.scanSliderCtx.lineWidth * 2,
      waveScanHeight - this.scanSliderCtx.lineWidth * 2
    );
    this.scanSliderCtx.stroke();
  };

  // 绘制主区域波形图
  drawMainWave = (startMs = 0) => {
    const { zoom } = this.state;
    const { onDrawMainWaveFinish = noop } = this.props;
    const { yMap, Ystart, xMap, rgb, backgroudcolor, wavecolor } = waveConfig.mainWaveConfig;
    const startPx = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, startMs, zoom);

    // 获取列
    // const totalColumn = waveGraph.getTotalColumn(this.waveId);
    // console.log(totalColumn, 'totalColumn');
    // console.log(startPx, 'startPx');
    // console.log(this.mainWaveWidth - startPx, totalColumn, 'totalColumn');

    /** 动态获取y轴刻度高度 */
    let sample = 0;
    let segment = 4;
    const yArr: Array<number> = [];
    if (this.sampleRate % 3 === 0) {
      segment = 3;
      sample = Number((this.sampleRate / 3 / 1000).toFixed());
    }
    if (this.sampleRate % 4 === 0) {
      segment = 4;
      sample = Number((this.sampleRate / 4 / 1000).toFixed());
    }

    for (let i = 0; i < segment; i++) {
      yArr.push(sample);
      sample += sample;
    }
    const arrBottom = yArr.map((item) => -item);
    const arrTop = yArr.reverse();
    const yScales: Array<number> = [...arrTop, 0].concat(arrBottom);

    // y轴网格
    const height = this.mainWaveHeight || 160;
    const dis = Math.floor(height / yScales.length);
    let start = 0 + 13;
    const yMaps: number[] = [];
    for (let i = 0; i < yScales.length; i++) {
      yMaps.push(start);
      start += dis;
    }

    // x轴网格
    const xScales = Math.ceil(this.mainWaveWidth / 14);
    const xMaps: number[] = [];
    let xStart = 0;
    for (let i = 0; i < xScales; i++) {
      xStart += xScales;
      xMaps.push(xStart);
    }

    return new Promise((resolve) => {
      const params = {
        waveId: this.waveId,
        height: this.mainWaveHeight,
        columnIndex: startPx,
        columnCount: this.mainWaveWidth,
        width: this.mainWaveWidth,
        Ystart,
        xMap: xMaps,
        yMap: yMaps,
        rgb,
        backgroudcolor,
        wavecolor
      };
      // this.setState({ mainLoading: true });
      waveGraph.getGraphCanvasData({
        ...params,
        cb: (buff) => {
          // 将uint8Array类型的buff转化为Uint8ClampedArray
          const uint8ClapedBuf = new Uint8ClampedArray(Array.from(buff));
          const imageData = new ImageData(uint8ClapedBuf, this.mainWaveWidth, this.mainWaveHeight);
          createImageBitmap(imageData).then((r) => {
            this.mainCtx.drawImage(r, 0, 0, this.mainWaveWidth, this.mainWaveHeight, 0, 8, this.mainWaveWidth, this.mainWaveHeight);
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
    const xAxisMinMs = Math.floor(this.drawTotalMs / smallTickCount / (zoom / 100));
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
          message.error(i18next.t('common:cannotPlay'));
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

  /** 绘制选中区域 */
  drawSelectArea = (startTime: number, endTime: number, isManual: boolean, clearnBg = true, signCate?: number) => {
    const { signsColors } = this.props;
    const mainHasMovedMs = this.getMainHasMovedX() * this.actualPerPxMeamMs;
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
    this.bgCtx.fillRect(startX, 8, endX - startX, this.mainWaveHeight);
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
    // Global.setRegion({
    //   ...Global.region,
    //   begin_time: this.selectStartMs
    // });
    // Global.setTotalMs(this.totalMs);
    bgWaveRef.current.addEventListener('mousemove', this.onBgMove);
    this.pause();
  };

  onBgMove = (e) => {
    const { Global } = this.props;
    if (!this.isDrawing) return;
    const rect = e.target.getBoundingClientRect();
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

  onBgUp = (e, isUp = true) => {
    const { bgWaveRef } = this.domRefs;
    const { Global } = this.props;

    if (!bgWaveRef.current) return;
    bgWaveRef.current.removeEventListener('mousemove', this.onBgMove);
    if (!isUp) return;
    this.onBgMove(e);
    this.isDrawing = false;
    if (this.selectStartMs > this.selectEndMs) {
      const temMs = this.selectStartMs;
      this.selectStartMs = this.selectEndMs;
      this.selectEndMs = temMs;
    }
    // Global.setRegion({
    //   ...Global.region,
    //   begin_time: this.selectStartMs,
    //   end_time: this.selectEndMs
    // });
    // Global.setTotalMs(this.totalMs);
    this.props.onSelectAreaChange && this.props.onSelectAreaChange(this.selectStartMs, this.selectEndMs);
  };

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

  pause = (playCurrentTime?: number) => {
    playCurrentTime = playCurrentTime || this.initPlay();
    this.audio?.pause();
    if (this.animationId) window.cancelAnimationFrame(this.animationId);
    this.setState({ playing: false, playCurrentTime });
  };

  zoomChange = (type: 'zoomIn' | 'zoomOut', nowZoom?: number) => {
    if (!this.state.isValidFile) return;
    const { onZoomChange } = this.props;
    const { zoom } = this.state;
    const changeZoom = type === 'zoomIn' ? waveConfig.zoomStep : -waveConfig.zoomStep;
    nowZoom = nowZoom ? nowZoom : zoom + changeZoom;
    if (nowZoom < 100) return;
    onZoomChange && onZoomChange(nowZoom);
    this.setState({ zoom: nowZoom }, () => {
      this.mainCtx.clearRect(0, 0, this.mainWaveWidth, this.mainWaveHeight);
      this.getWaveHead();
      this.drawMainWave();
      this.xAxisCtx.clearRect(0, 0, this.mainWaveWidth, waveConfig.xAxisConfig.xAxisHeight);
      this.drawXAxis(0);
      this.drawScanSlider();
      this.drawMultiSelectArea();
      this.drawSelectArea(this.selectStartMs, this.selectEndMs, true, false);
      this.drawSign();
    });
  };

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
      message.error({ content: i18next.t('common:repeatSignName'), duration: 1 });
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
      message.error({ content: i18next.t('common:hasSigned'), duration: 1 });
      return false;
    }
    signItem.id = uuidv4();
    signItem.isManual = true;
    signItem.isVisible = !hasSameTimeArea(false);
    this.signAll.unshift(signItem);
    this.drawSign();
    const manualSigns = this.signAll.filter((item) => item.isManual === true);
    this.setState({ manualSigns });
    message.success({ content: i18next.t('common:addSignSucc'), duration: 1 });
    return true;
  };

  /** 编辑标注 */
  editSign = (signItem: SignProps) => {
    const hasSameName = this.signAll.some((k) => k.isManual === signItem.isManual && k.name === signItem.name);
    if (hasSameName) {
      message.error({ content: i18next.t('common:repeatSignName'), duration: 1 });
      return false;
    }
    const idx = this.signAll.findIndex((k) => k.id === signItem.id);
    if (idx > -1) {
      this.signAll[idx] = signItem;
      const manualSigns = this.signAll.filter((item) => item.isManual === true);
      this.setState({ manualSigns });
    }
    this.drawSign();
    message.success({ content: i18next.t('common:editSignSucc'), duration: 1 });
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
      message.error(i18next.t('common:signPla'));
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
    this.scanStartX = e.clientX;
    scanSliderRef.current.style.cursor = '-webkit-grab';
    window.addEventListener('mouseup', this.onSliderUp);
    window.addEventListener('mousemove', this.onSliderMove);
  };

  onSliderMove = (e) => {
    const { scanSliderRef } = this.domRefs;
    if (!scanSliderRef.current) return;
    scanSliderRef.current.style.cursor = '-webkit-grab';
    const posX = e.clientX;
    const currentScanX = this.prevScanStartX + posX - this.scanStartX;
    const mainHasMovedX = this.getMainHasMovedX(currentScanX);
    const startMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, mainHasMovedX, this.state.zoom);
    const totalMs = waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, mainHasMovedX + this.mainWaveWidth, this.state.zoom);
    this.drawMultiSelectArea();
    this.drawSelectArea(this.selectStartMs, this.selectEndMs, true, false);
    if (totalMs > this.totalMs || currentScanX < 0) {
      return;
    }

    this.drawSign();
    this.drawXAxis(startMs);
    this.updateMainWave(startMs);
    this.drawScanSlider(currentScanX, false);
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
    this.drawMainWave();
    this.drawWaveScan();
    this.drawXAxis(0);
  };

  waveSaveTmp = () => {
    const tempFilePath = path.join(Reflect.get($$, 'tempFiles'), `tmp.wav`);
    waveGraph.saveEdit(this.waveId, tempFilePath, (res) => {
      if (res) {
        this.audio.src = `file:\\\\\\${tempFilePath}`;
        this.audio.playbackRate = this.state.playbackRates.value;
      }
    });
  };

  waveAction = utils.debounce((receiveParams) => {
    const { type, name, id } = receiveParams;
    const { Global, fileId } = this.props;
    const { copyByteSizeLimit } = waveConfig;
    const positon = this.selectStartMs;
    const size = this.selectEndMs - this.selectStartMs;
    const selectByteSize = (size / this.totalMs) * this.pcmSize;
    if (selectByteSize > copyByteSizeLimit) {
      message.warning(i18next.t('common:editAreaLimit'));
      return;
    }
    switch (type) {
      case 'select_all': {
        this.selectStartMs = 0;
        this.selectEndMs = this.totalMs;
        this.drawSelectArea(0, this.totalMs, true, true);
        break;
      }
      case 'space': {
        const { playCurrentTime, playing } = this.state;
        if (playing) {
          this.pause(playCurrentTime);
        } else {
          PubSub.publishSync('stopAllAudio');
          this.play();
        }
        break;
      }
      case 'cut': {
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
          }
        });
        break;
      }
      case 'copy': {
        if (!size) return;
        const copyData: Buffer | Uint8Array = waveGraph.getData(this.waveId, this.selectStartMs, this.selectEndMs);
        Global.setCacheWaveData({ orignFileId: fileId, orignWaveId: this.waveId, originBufMs: size, orignCutBuf: copyData });
        message.success(i18next.t('common:copySucc'));
        break;
      }
      case 'paste': {
        if (!Global.waveCacheData.originBufMs) return;
        const waveInsertParams: WaveEditParam = {
          type: 'insert',
          positon,
          size: toJS(Global.waveCacheData.originBufMs),
          data: toJS(Global.waveCacheData.orignCutBuf)
        };
        waveGraph.editWave(this.waveId, waveInsertParams, (res: WaveEditResult) => {
          if (res.ok) {
            // this.drawTotalMs = this.drawTotalMs + Global.waveCacheData.originBufMs;
            this.reDraw();
            this.drawXAxis(0);
            this.setState({ hasEdit: true });
            this.updateWave();
            Global.setCacheWaveData({});
            this.onAddAreas(positon, size + positon);
          }
        });
        break;
      }
      case 'clear': {
        if (!size) return;
        const waveClearParams: WaveEditParam = { type: 'clear', positon, size };
        waveGraph.editWave(this.waveId, waveClearParams, (res: WaveEditResult) => {
          if (res.ok) {
            // this.drawTotalMs = this.drawTotalMs - size;
            this.reDraw();
            this.setState({ hasEdit: true });
            this.updateWave();
            Global.setCacheWaveData({});
          }
        });
        break;
      }
      case 'delete': {
        if (!size) return;
        const waveDeleteParams: WaveEditParam = { type: 'delete', positon, size };
        waveGraph.editWave(this.waveId, waveDeleteParams, (res: WaveEditResult) => {
          if (res.ok) {
            // this.drawTotalMs = this.drawTotalMs - size;
            this.reDraw();
            this.setState({ hasEdit: true });
            this.updateWave();
            Global.setCacheWaveData({});
            this.onDeleteAreas(this.selectStartMs, this.selectEndMs);
          }
        });
        break;
      }
      case 'save': {
        if (!this.state.hasEdit) {
          message.warning(i18next.t('common:noNeedSave'));
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
      case 'undo': {
        if (this.waveId < 0 || this.operationRecord.length === 0) return;
        waveGraph.undoEdit(this.waveId, (res: WaveUndoResult) => {
          if (res.ok) {
            // this.drawTotalMs = res.index > 0 ? this.drawTotalMs + res.size : this.totalMs;
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
      case 'setAllSelection': {
        this.selectStartMs = 0;
        this.selectEndMs = this.totalMs;
        this.drawSelectArea(this.selectStartMs, this.selectEndMs, true);
        Global.setTotalMs(this.totalMs);
        Global.setRegion({
          begin_time: 0,
          end_time: this.totalMs
        });
        break;
      }
      case 'cancelAllSelection': {
        this.selectStartMs = 0;
        this.selectEndMs = 0;
        this.drawSelectArea(this.selectStartMs, this.selectEndMs, true);
        Global.setRegion({
          begin_time: 0,
          end_time: 0
        });
        break;
      }
      case 'addSign': {
        const addSignParams = { startTime: this.selectStartMs, isManual: true, endTime: this.selectEndMs, name };
        this.addSign(addSignParams);
        break;
      }
      case 'editSign': {
        this.editSign(receiveParams);
        break;
      }
      case 'deleteSign': {
        this.deleteSign(id);
        break;
      }
      default:
        break;
    }
  });

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
      isValidFile
    } = this.state;
    const {
      onDoubleClickSign,
      showAddBtn = true,
      showSmartSign = true,
      showManualSign = true,
      showSelectArea = true,
      smartSignTitle,
      isSearchVoiceSign,
      playbackRates
    } = this.props;
    return isValidFile ? (
      <div
        className="wave"
        onClick={() => {
          Mousetrap.unbind('space');
          Mousetrap.bind('space', (e: KeyboardEvent) => {
            e.preventDefault();
            this.waveAction({ type: 'space' });
          });
        }}
      >
        <div className="wave-graph">
          <div className="flex">
            <div className="ui-h-100" style={{ width: this.yAxisWidth }}>
              <canvas className="ui-h-100" ref={yAxisRef}></canvas>
            </div>
            <div className="flex-1 ui-ov-h">
              <div className="wave-head">
                <canvas ref={scanWaveRef} className="wave-head-scan"></canvas>
                <canvas
                  ref={scanSliderRef}
                  onMouseLeave={(e) => this.onBgUp(e, false)}
                  onMouseDown={this.onSliderDown}
                  onMouseUp={this.onBgUp}
                  className="wave-scan-slider"
                ></canvas>
              </div>

              <div className="wave-content" ref={clientRef}>
                <div>
                  <canvas
                    className="wave-content-bg"
                    ref={bgWaveRef}
                    onMouseLeave={(e) => this.onBgUp(e, false)}
                    onMouseDown={this.onBgDown}
                    onMouseUp={this.onBgUp}
                    onWheel={this.onWheel}
                  />
                  <Spin spinning={mainLoading || scanLoading} style={{ height: '100%' }}>
                    <canvas className="wave-content-fore" ref={mainWaveRef} style={{ cursor: 'text' }} />
                  </Spin>
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
                  onDoubleClick={(e) => this.signDoubleClick(e, false)}
                  onClick={(e) => this.signClick(e, false)}
                  className="sign-area-bg"
                  ref={smartSignRef}
                  style={{ cursor: 'text' }}
                  title={i18next.t('common:lookMore')}
                />
                <div className="sign-img-contain">
                  {smartSignTitle ? (
                    <span>{smartSignTitle}</span>
                  ) : (
                    <>
                      {i18next.t('common:autoSign')}
                      <img src={atlas_label} className="smart_img" title={i18next.t('common:autoSign')} alt={i18next.t('common:autoSign')} />
                    </>
                  )}
                </div>
                <Popover
                  placement="left"
                  title={
                    <div className="flex just-between">
                      <div>{`${i18next.t('common:sign')}（${this.signAll?.length}）`}</div>
                      <div
                        className="cursor fz20"
                        title={i18next.t('common:close')}
                        style={{ lineHeight: '14px' }}
                        onClick={() => this.setState({ smartSignListVisible: false })}
                      >
                        ×
                      </div>
                    </div>
                  }
                  content={() => <SignTable isSearchVoiceSign={isSearchVoiceSign} dataSource={this.signAll.filter((item) => !item.isManual)} />}
                  trigger="click"
                  visible={smartSignListVisible}
                  overlayClassName="sign_modal"
                >
                  <img
                    src={smartSignListVisible ? more_signclose : more_signopen}
                    className="sign_collapsed"
                    title={smartSignListVisible ? i18next.t('common:hideSignList') : i18next.t('common:showSignList')}
                    alt={i18next.t('common:sign')}
                    onClick={() => {
                      this.setState({ manualSignListVisible: false });
                      this.setState({ smartSignListVisible: !smartSignListVisible });
                    }}
                  />
                </Popover>
                <img
                  src={smartSignVisible ? atlas_eyesopen : atlas_eyesclose}
                  className="visible_img"
                  title={smartSignVisible ? i18next.t('common:showAutoSign') : i18next.t('common:hideAutoSign')}
                  alt={i18next.t('common:hide')}
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
                title={signVisible ? i18next.t('common:show') : i18next.t('common:hide')}
                alt={i18next.t('common:hide')}
                onClick={this.toggleSign}
              />
              <Popover
                style={{ zIndex: 2 }}
                placement="left"
                title={
                  <div className="flex just-between">
                    <div>{`${i18next.t('common:sign')}（${manualSigns?.length}）`}</div>
                    <div
                      className="cursor fz20"
                      title={i18next.t('common:close')}
                      style={{ lineHeight: '14px' }}
                      onClick={() => this.setState({ manualSignListVisible: false })}
                    >
                      ×
                    </div>
                  </div>
                }
                content={() => <SignTable dataSource={[...manualSigns]} onEditSign={onDoubleClickSign} />}
                trigger="click"
                visible={manualSignListVisible}
                overlayClassName="sign_modal"
              >
                <img
                  src={manualSignListVisible ? more_signclose : more_signopen}
                  className="sign_collapsed"
                  title={manualSignListVisible ? i18next.t('common:hideSignList') : i18next.t('common:showSignList')}
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
                  {i18next.t('common:selectArea')}&nbsp;
                  {utils.toHHmmss(this.selectStartMs)}-{utils.toHHmmss(this.selectEndMs)}
                </span>
              ) : null}
              <span>
                {i18next.t('common:time')}&nbsp;
                {utils.toHHmmss(this.totalMs)}
              </span>
            </span>
            <div className="play-action word-nowrap">
              {playing ? (
                <img
                  src={atlas_stop}
                  className="operate_img"
                  title={i18next.t('common:pause')}
                  alt={i18next.t('common:pause')}
                  onClick={() => this.pause(playCurrentTime)}
                />
              ) : (
                <img src={atlas_play} className="operate_img" title={i18next.t('common:play')} alt={i18next.t('common:play')} onClick={() => this.play()} />
              )}
              {showAddBtn ? (
                <img
                  src={atlas_sign}
                  className="operate_img ui-ml-10"
                  title={i18next.t('common:addSign')}
                  alt={i18next.t('common:addSign')}
                  onClick={this.onAddSign}
                />
              ) : null}
              <div onClick={(e) => e.stopPropagation()} style={{ display: 'inline-block' }}>
                <Popover
                  trigger="focus"
                  visible={this.state.playbackRateVisible}
                  overlayClassName="playbackRates"
                  onVisibleChange={() => {
                    this.setState({ playbackRateVisible: true });
                  }}
                  content={
                    <div>
                      {waveConfig.playbackRates.map((item) => {
                        return (
                          <div
                            className="play_back_rate"
                            key={item.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              this.setState({ playbackRates: item, playbackRateVisible: false });
                              this.audio.playbackRate = item.value;
                              return;
                            }}
                          >
                            <span className="content">{item.value === 1 ? `${item.label}${i18next.t('common:playbackRatesNormal')}` : item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  }
                >
                  <Button size="small" className="play_backRate_btn">
                    {this.state.playbackRates.label}
                  </Button>
                </Popover>
              </div>
            </div>
            <div className="zoom-area">
              <img
                src={atlas_big}
                className="operate_img"
                title={i18next.t('common:zoomIn')}
                alt={i18next.t('common:zoomIn')}
                onClick={() => this.zoomChange('zoomIn')}
              />
              <img
                src={atlas_sma}
                className="operate_img ui-ml-10"
                title={i18next.t('common:zoomOut')}
                alt={i18next.t('common:zoomOut')}
                onClick={() => this.zoomChange('zoomOut')}
              />
              <Select
                defaultValue={playbackRates[2].value}
                style={{ width: 70 }}
                // onChange={(value) => (this.audio.playbackRate = value)}
                className="scale-select"
                size="small"
              >
                {playbackRates.map((item) => (
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
              height: 30px;
              position: relative;
            }
            .wave-scan-slider {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 2;
              opacity: 0.45;
              border: 1px solid #009ee9;
            }
            .wave-head-scan {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }

            .wave-content {
              position: relative;
              flex: 1;
            }
            .wave-content-bg {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 1;
            }
            .wave-content-force {
              position: absolute;
              top: 0;
              left: 0;
              z-index: 2;
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
