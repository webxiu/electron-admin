import { Button, Popover, Select, Spin, message } from 'antd';
import React, { Component, createRef } from 'react';
import { ShortcutKeyItemType, shortcutKeyDefaultList } from '@/Render/config/wave.config';
import { execFfmpeg, sampleObj, saveFfmpeg } from './ffmpeg';
import { inject, observer } from 'mobx-react';
import waveGraph, { WaveEditParam, WaveEditResult, WaveUndoResult } from '~/source/Wave-Graph-X64';

import { AppEventNames } from '~/src/Types/EventTypes';
import Mousetrap from 'mousetrap';
import PubSub from 'pubsub-js';
import SignTable from './components/SignTable';
import { VIDEO_STATUS } from '@/Render/components/NPlayer';
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
  /** 是否为以音搜音图谱(用于标注折叠表格配置) */
  onZoomChange?: (zoom: number) => void;
  /** 不同标记颜色 */
  signsColors?: string[];
  /** 右键菜单列表 */
  contextMenuList?: ShortcutKeyItemType[];
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
let PlayBarTimer: NodeJS.Timeout;

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
    smartSignRef: createRef<HTMLCanvasElement>(),
    signAreaRef: createRef<HTMLDivElement>(),
    contextMenuRef: createRef<HTMLDivElement>()
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
  EventClock = ''; // 全局移动事件锁, 避免与顶部滑块冲突(onBgDown/onSliderDown)
  InTimeLine = false; // 是否在时间线上点击
  selectTimeLine = ''; // L:开始时间线  R:结束时间线 M:播放时间线

  constructor(props) {
    super(props);
    this.handleResize = utils.debounce(this.resize);
  }

  handleResize: () => void;
  componentDidMount() {
    this.initCanvas();
    this.loadFile();
    const { fileId, activeFileId } = this.props;
    const { clientRef, contextMenuRef } = this.domRefs;
    window.addEventListener('resize', this.handleResize);
    window.addEventListener(
      'click',
      utils.debounce(() => {
        if (contextMenuRef.current) {
          contextMenuRef.current.style.display = 'none';
        }
        this.setState({ playbackRateVisible: false });
      })
    );

    /** 展开标记滚动不隐藏处理 */
    window.addEventListener('wheel', (e: any) => {
      let inPopoverScroll: boolean = false;
      const signsPopoverClassName = ['sign-scroll-event', 'ant-table-cell', 'ant-popover-title', 'ant-popover-inner-content', 'SVGAnimatedString'];
      for (let i = 0; i < signsPopoverClassName.length; i++) {
        const classStr = signsPopoverClassName[i];
        const popClassName = e.target.className.toString();
        if (popClassName.indexOf(classStr) > -1) {
          inPopoverScroll = true;
          break;
        }
      }
      if (inPopoverScroll) return;

      const { manualSignListVisible, smartSignListVisible } = this.state;
      if (manualSignListVisible) {
        this.setState({ manualSignListVisible: false });
      }
      if (smartSignListVisible) {
        this.setState({ smartSignListVisible: false });
      }
    });

    /** 监听折叠重新加载图谱 */
    PubSub.subscribe(AppEventNames.RELOAD_WAVE, (msg: string) => {
      if (this.waveId > -1) {
        this.handleResize();
      }
    });

    this.subToken = PubSub.subscribe('stopAllAudio', (name: string, isPlay: boolean) => {
      this.pause();
    });

    PubSub.subscribe(AppEventNames.WAVE_ACTION, (msg: string, data) => {
      this.waveAction(data);
    });

    /** 导出标注 */
    PubSub.subscribe(AppEventNames.EXPORT_MARK, (msg: string, data: { src: string; fileName: string; fileId: number }) => {
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

    /** 接收播放器事件 */
    PubSub.subscribe(AppEventNames.CONTROL_WAVE, (msg: string, params) => {
      const { currentTime, playing, videoFileId } = params.data;

      if (currentTime === undefined || videoFileId !== fileId || !this.audio) {
        return;
      }
      const startXMs = currentTime * 1000;
      const startX = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, startXMs, this.state.zoom);
      const startScanX = startX * (this.scanSliderWidth / this.mainWaveWidth);
      const waveMaxMs = startXMs + this.actualPerPxMeamMs * this.mainWaveWidth;

      this.prevScanStartX = startScanX;
      this.audio.currentTime = currentTime;
      this.selectStartMs = startXMs;
      this.selectEndMs = startXMs;

      if (params.type !== VIDEO_STATUS.seek) {
        playing && !this.state.hasEdit ? this.play() : this.pause(startXMs);
      } else {
        this.setState({ playCurrentTime: startXMs });

        // 更新
        this.drawTimeLine(startScanX, true);
        if (waveMaxMs > this.totalMs) {
          return;
        }
        this.drawSign();
        this.drawMultiSelectArea();
        this.drawSelectArea(this.selectStartMs, this.selectEndMs, true, false);
        this.drawXAxis(startXMs);
        this.updateMainWave(startXMs);
        this.drawTimeLine(startScanX, true);
      }
    });

    /** 注册默认快捷键 */
    shortcutKeyDefaultList.forEach((s) => {
      Mousetrap.bind(s.key, (e: KeyboardEvent) => {
        e.preventDefault();
        this.waveAction({ type: s.type });
      });
    });

    // 右键菜单位置
    clientRef.current?.addEventListener('contextmenu', (e: any) => {
      if (!e.target || !contextMenuRef.current) return;
      const waveContextMenu = document.querySelectorAll('.wave-context_menu');
      waveContextMenu.forEach((mDom: HTMLDivElement) => {
        mDom.style.display = 'none';
      });

      if (e.target.id === `bg_wave_${fileId}`) {
        contextMenuRef.current.style.display = 'block';
        contextMenuRef.current.style.position = 'fixed';
        contextMenuRef.current.style.top = e.clientY + 'px';
        contextMenuRef.current.style.left = e.clientX + 'px';
      } else {
        contextMenuRef.current.style.display = 'none';
      }
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    PubSub.unsubscribe(this.subToken);
    PubSub.unsubscribe(`WAVE_ACTION_${this.props.fileId}`);
    PubSub.unsubscribe(AppEventNames.EXPORT_MARK);
    PubSub.unsubscribe(AppEventNames.CONTROL_WAVE);
    PubSub.unsubscribe(AppEventNames.RELOAD_WAVE);
    cacheWaveId = {};
    shortcutKeyDefaultList.forEach((s) => Mousetrap.unbind(s.key));
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
    const { scanWaveRef, bgWaveRef, mainWaveRef, clientRef, xAxisRef, yAxisRef, scanSliderRef, signRef, smartSignRef, contextMenuRef } = this.domRefs;
    if (
      !clientRef.current ||
      !mainWaveRef.current ||
      !scanWaveRef.current ||
      !xAxisRef.current ||
      !yAxisRef.current ||
      !bgWaveRef.current ||
      !scanSliderRef.current ||
      !signRef.current ||
      !contextMenuRef.current
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
    const { onDuration = noop, selectArea, smartSign = [], fileId } = this.props;

    if (cacheWaveId[fileId]) return;
    await this.loadAudio().catch(console.error);
    if (!this.isExistPath()) return;
    this.waveId = waveGraph.createDraw(this.filePath);
    if (!this.isExistPath()) return;
    if (this.waveId === -1) {
      console.error('文件读取失败！');
      return;
    }
    cacheWaveId[fileId] = this.waveId;
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
    if (this.selectStartMs || this.selectEndMs) {
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
      try {
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
      } catch (error) {
        console.log('drawMainWave Error:', error);
      }
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

  getNewPxStartMs(posPx) {
    // 坐标移动 获取最新的开始时间
    const mainHasMovedMs = this.getMainHasMovedX() * this.actualPerPxMeamMs;
    const newStartMs = Math.floor(waveUtil.pxToMs(this.totalMs, this.mainWaveWidth, posPx, this.state.zoom) + mainHasMovedMs);
    return newStartMs;
  }

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
        this.onControlVideo(VIDEO_STATUS.pause, { currentTime: playStartMs / 1000 });
        return;
      }
      playStartMs = this.playList[this.playIndex].startTime;
      this.audio.currentTime = playStartMs / 1000;
      this.onControlVideo(VIDEO_STATUS.play, { currentTime: playStartMs / 1000 });
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
          this.onControlVideo(VIDEO_STATUS.play, { currentTime: playCurrentTime / 1000 });
          this.drawPlay();
        })
        .catch((e) => {
          message.error('暂不支持播放');
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
    const rePlayInitTime = this.state.playCurrentTime === this.totalMs ? 0 : this.state.playCurrentTime;
    const playCurrentTime = playList.length ? this.playList[this.playIndex].startTime : rePlayInitTime;
    return playCurrentTime;
  };

  pause = (playCurrentTime?: number) => {
    playCurrentTime = playCurrentTime || this.initPlay();
    this.audio?.pause();
    this.onControlVideo(VIDEO_STATUS.pause, { currentTime: this.selectStartMs / 1000 });
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
    const { backgroundColor } = isManual ? waveConfig.selectArea : waveConfig.smartSelectArea;
    clearnBg && this.bgCtx.clearRect(0, 0, this.mainWaveWidth, this.mainWaveHeight);
    const signBgColor = signsColors?.length && signCate ? signsColors[signCate % signsColors.length] : backgroundColor;
    this.bgCtx.fillStyle = signBgColor;
    const startX = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, startTime, this.state.zoom);
    const endX = waveUtil.msToPx(this.totalMs, this.mainWaveWidth, endTime, this.state.zoom);
    if (startX) {
      this.drawTimeLine(startX, false);
    }
    if (endX) {
      this.drawTimeLine(endX, false);
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

  getRealPos = (e) => {
    const { clientX, clientY } = e;
    const { left, top } = e.target.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    return { x, y };
  };
  /** 获取坐标参数 */
  getDirection = (e) => {
    const { x, y } = this.getRealPos(e);
    const { offsetLine, selectArea } = waveConfig;
    const startX = Math.floor(waveUtil.msToPx(this.totalMs, this.mainWaveWidth, this.selectStartMs, this.state.zoom));
    const endX = Math.floor(waveUtil.msToPx(this.totalMs, this.mainWaveWidth, this.selectEndMs, this.state.zoom));
    const moveMs = this.getNewPxStartMs(x);
    const moveX = Math.floor(waveUtil.msToPx(this.totalMs, this.mainWaveWidth, moveMs, this.state.zoom));

    // 移动鼠标前后偏差offsetLine个像素对齐(兼容缩放)
    const inStart = moveX >= startX - offsetLine && moveX <= startX + offsetLine;
    const inEnd = moveX >= endX - offsetLine && moveX <= endX + offsetLine;
    const nearPos = inStart || inEnd;

    const nearValue = waveUtil.findNearNum([this.selectStartMs, this.selectEndMs], moveMs);
    const isAreaColor = this.bgCtx.getImageData(x, y, 1, 1).data[1];
    const twoColor = Number(selectArea.backgroundColor.split(',')[1]);
    // 通过选区颜色的第二个颜色值(88)与图谱背景颜色(0),判断鼠标是否在选择线上
    const moveIn = ![twoColor, 0].includes(isAreaColor) || nearPos;

    let selectTimeLine: string = '';
    if (moveIn) {
      if (this.selectStartMs === this.selectEndMs) {
        selectTimeLine = 'M';
      } else if (nearValue === this.selectStartMs) {
        selectTimeLine = 'L';
      } else if (nearValue === this.selectEndMs) {
        selectTimeLine = 'R';
      }
    }
    return { x, y, moveIn, selectTimeLine, moveMs };
  };
  /** 仅改变鼠标形状 */
  onMainMouseMove = (e) => {
    const { bgWaveRef } = this.domRefs;
    if (!bgWaveRef.current) return;
    const { moveIn } = this.getDirection(e);
    const cursor = moveIn ? 'col-resize' : 'default';
    bgWaveRef.current.style.cursor = cursor;
  };

  onBgDown = (e) => {
    e.persist();
    const { bgWaveRef } = this.domRefs;
    if (!bgWaveRef.current || e.button !== 0) return;
    this.EventClock = 'onBgDown';
    const direction = this.getDirection(e);
    this.isDrawing = true;
    this.InTimeLine = direction.moveIn;
    this.selectTimeLine = direction.selectTimeLine;
    if (!this.InTimeLine) {
      this.selectStartMs = this.getNewPxStartMs(direction.x);
      this.selectEndMs = this.selectStartMs;
    }
    this.pause(this.selectStartMs);
    window.addEventListener('mouseup', this.onBgUp);
    window.addEventListener('mousemove', this.onBgMove);
  };

  onBgMove = (e: MouseEvent) => {
    const { bgWaveRef, contextMenuRef } = this.domRefs;
    const { x } = this.getRealPos(e);
    if (this.EventClock !== 'onBgDown' || !bgWaveRef.current || !this.isDrawing) return;
    contextMenuRef.current && (contextMenuRef.current.style.display = 'none');

    const rect = bgWaveRef.current.getBoundingClientRect();
    const { moveMs } = this.getDirection(e);

    bgWaveRef.current.style.cursor = 'pointer';
    // 鼠标是否超出图谱
    if (e.clientX < rect.left || e.clientX > rect.right - 1) {
      PlayBarTimer && clearInterval(PlayBarTimer);
      const speed = e.clientX < rect.left ? -10 : 10;

      this.scanStartX = 0;
      PlayBarTimer = setInterval(() => {
        this.onSliderMove(speed, 'onSliderDown');
        if (this.selectTimeLine === 'M') {
          this.selectStartMs = this.selectEndMs = moveMs;
          this.drawTimeLine(x);
          return;
        } else {
          this.moveSelect(x, e, rect);
        }
      }, 200);
      return;
    } else {
      clearInterval(PlayBarTimer);
      // 移动播放条, 否则移动选区
      if (this.selectTimeLine === 'M') {
        this.selectStartMs = this.selectEndMs = moveMs;
        this.drawTimeLine(x);
        return;
      } else {
        this.moveSelect(x, e, rect);
      }
    }
  };
  /** 移动时间线选择 */
  moveSelect(x: number, e: MouseEvent, rect: DOMRect) {
    // 1.区域内部移动
    if (e.clientX >= rect.left && e.clientX <= rect.right) {
      const moveMs = this.getNewPxStartMs(x);
      if (this.InTimeLine) {
        if (this.selectTimeLine === 'L') {
          this.selectStartMs = moveMs;
        } else if (this.selectTimeLine === 'R') {
          this.selectEndMs = moveMs;
        }
      } else {
        this.selectEndMs = moveMs;
      }
    } else {
      // 2.超出左右边界处理
      if (e.clientX < rect.left) {
        if (this.selectTimeLine) {
          if (this.selectTimeLine === 'L') {
            this.selectStartMs = this.xAxisStartMs;
          } else if (this.selectTimeLine === 'R') {
            this.selectEndMs = this.xAxisStartMs;
          }
        } else {
          this.selectEndMs = this.xAxisStartMs;
        }
      } else if (e.clientX > rect.right) {
        const waveMaxMs = this.xAxisStartMs + this.actualPerPxMeamMs * this.mainWaveWidth;
        if (this.selectTimeLine) {
          if (this.selectTimeLine === 'L') {
            this.selectStartMs = waveMaxMs;
          } else if (this.selectTimeLine === 'R') {
            this.selectEndMs = waveMaxMs;
          }
        } else {
          this.selectEndMs = waveMaxMs;
        }
      }
    }

    this.isManual = true;
    this.signAll.forEach((k) => (k.isVisible = false));
    this.drawSelectArea(this.selectStartMs, this.selectEndMs, this.isManual);
  }

  onBgUp = (e) => {
    if (this.EventClock !== 'onBgDown') return;
    const { Global, onSelectAreaChange = noop } = this.props;
    const { bgWaveRef } = this.domRefs;
    if (!bgWaveRef.current) return;
    this.isDrawing = false;
    PlayBarTimer && clearInterval(PlayBarTimer);
    window.removeEventListener('mouseup', this.onBgUp);
    window.removeEventListener('mousemove', this.onBgMove);

    // 鼠标抬起, 时间线未移动
    if (this.selectStartMs === this.selectEndMs) {
      const { x } = this.getRealPos(e);
      const isInSelectArea = this.signAll.find(
        ({ isVisible, startTime, endTime }) => isVisible && startTime <= this.selectEndMs && this.selectEndMs <= endTime
      );
      if (isInSelectArea) {
        this.isManual = isInSelectArea.isManual;
        this.drawMultiSelectArea();
        this.drawTimeLine(x, false);
      } else {
        this.signAll.forEach((k) => (k.isVisible = false));
        this.drawSelectArea(this.selectStartMs, this.selectEndMs, this.isManual);
        this.drawTimeLine(x);
      }
      if (this.InTimeLine) {
        this.pause(this.selectStartMs); // 处理播放时间线拖动时, 更新视频进度条
      }
    }

    if (this.selectStartMs > this.selectEndMs) {
      const temMs = this.selectStartMs;
      this.selectStartMs = this.selectEndMs;
      this.selectEndMs = temMs;
    }
    this.selectStartMs = Math.ceil(this.selectStartMs);
    this.selectEndMs = Math.ceil(this.selectEndMs);

    this.setState({ playCurrentTime: this.selectStartMs });
    onSelectAreaChange(this.selectStartMs, this.selectEndMs);
    Global.setTotalMs(this.totalMs);
    Global.setRegion({ ...Global.region, begin_time: this.selectStartMs, end_time: this.selectEndMs });
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
    const { onZoomChange } = this.props;
    const { zoom } = this.state;
    const changeZoom = type === 'zoomIn' ? waveConfig.zoomStep : -waveConfig.zoomStep;
    nowZoom = nowZoom ? nowZoom : zoom + changeZoom;
    if (nowZoom < 100) nowZoom = 100;
    if (zoom === 100 && zoom === nowZoom) return;

    onZoomChange && onZoomChange(nowZoom);
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
    const posMs = this.getNewPxStartMs(posPx);
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
      message.error({ content: '标注名称重复', duration: 1 });
      return false;
    }
    const hasSameTimeArea = (isManual) => {
      return this.signAll.some((k) => {
        if (k.isManual === isManual && k.startTime <= signItem.startTime && signItem.endTime <= k.endTime) {
          return true;
        }
        return false;
      });
    };
    if (hasSameTimeArea(true)) {
      message.error({ content: '该时间段已经添加过标注！', duration: 1 });
      return false;
    }
    signItem.id = uuidv4();
    signItem.isManual = true;
    signItem.isVisible = !hasSameTimeArea(false);
    this.signAll.unshift(signItem);
    this.drawSign();
    const manualSigns = this.signAll.filter((item) => item.isManual === true);
    this.setState({ manualSigns });
    message.success({ content: '添加标注成功', duration: 1 });
    return true;
  };

  /** 编辑标注 */
  editSign = (signItem: SignProps) => {
    const hasSameName = this.signAll.some((k) => k.isManual === signItem.isManual && k.name === signItem.name);
    if (hasSameName) {
      message.error({ content: '标注名称重复', duration: 1 });
      return false;
    }
    const idx = this.signAll.findIndex((k) => k.id === signItem.id);
    if (idx > -1) {
      this.signAll[idx] = signItem;
      const manualSigns = this.signAll.filter((item) => item.isManual === true);
      this.setState({ manualSigns });
    }
    this.drawSign();
    message.success({ content: '编辑标注成功', duration: 1 });
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
      message.error('请选择标注区域！');
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
    this.EventClock = 'onSliderDown';
    const rect = e.target.getBoundingClientRect();
    this.scanStartX = e.clientX - rect.left;
    scanSliderRef.current.style.cursor = '-webkit-grab';
    window.addEventListener('mouseup', this.onSliderUp);
    window.addEventListener('mousemove', this.onSliderMove);
  };

  onSliderMove = (e, type?) => {
    if ((type || this.EventClock) !== 'onSliderDown') return;
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

  onSliderUp = (e) => {
    const { scanSliderRef } = this.domRefs;
    if (!scanSliderRef.current) return;
    if (this.EventClock !== 'onSliderDown') return;
    scanSliderRef.current.style.cursor = 'default';
    window.removeEventListener('mouseup', this.onSliderUp);
    window.removeEventListener('mousemove', this.onSliderMove);
    this.prevScanStartX = this.currentScanStartX;
  };

  /** 下一次重绘更新图谱 */
  updateMainWave = utils.throttle((startMs) => {
    requestAnimationFrame(() => {
      this.drawMainWave(startMs);
    });
  }, 200);

  signDoubleClick = (e, isManual = true) => {
    const rect = e.target.getBoundingClientRect();
    const posPx = e.clientX - rect.left;
    const activeTime = this.getNewPxStartMs(posPx);
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
    const { Global, fileId, onSelectAreaChange = noop } = this.props;
    const { copyByteSizeLimit } = waveConfig;
    const positon = this.selectStartMs;
    const size = this.selectEndMs - this.selectStartMs;
    const selectByteSize = (size / this.totalMs) * this.pcmSize;
    if (selectByteSize > copyByteSizeLimit) {
      message.warning('操作区域太大');
      return;
    }
    switch (type) {
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
          this.onEditWaveGraph();
        });
        break;
      }
      case 'wave_copy': {
        if (!size) return;
        const copyData: Buffer | Uint8Array = waveGraph.getData(this.waveId, this.selectStartMs, this.selectEndMs);
        Global.setCacheWaveData({ orignFileId: fileId, orignWaveId: this.waveId, originBufMs: size, orignCutBuf: copyData });
        message.success('复制成功');
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
            this.drawSelectArea(this.selectStartMs, this.selectEndMs, true);
          }
          this.onEditWaveGraph();
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
            this.onDeleteAreas(this.selectStartMs, this.selectEndMs);
            this.drawSelectArea(this.selectStartMs, this.selectEndMs, true);
          }
          this.onEditWaveGraph();
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
          this.onEditWaveGraph();
        });
        break;
      }
      case 'wave_save': {
        if (!this.state.hasEdit) {
          message.warning('无需保存');
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
          this.onEditWaveGraph();
        });
        break;
      }
      case 'select_all': {
        this.selectStartMs = 0;
        this.selectEndMs = Math.floor(this.totalMs);
        Global.setTotalMs(this.totalMs);
        Global.setRegion({ begin_time: 0, end_time: this.totalMs });
        this.drawSelectArea(0, this.selectEndMs, true, true);
        onSelectAreaChange(0, this.selectEndMs);
        break;
      }
      case 'cancel_select_all': {
        this.selectStartMs = 0;
        this.selectEndMs = 0;
        this.drawSelectArea(this.selectStartMs, this.selectEndMs, true);
        Global.setRegion({ begin_time: 0, end_time: 0 });
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
        this.deleteSign(activeFileId);
        break;
      }
      case 'wave_right': {
        this.scanStartX = 0;
        this.EventClock = 'onSliderDown';
        this.onSliderMove(10);
        break;
      }
      case 'wave_left': {
        this.scanStartX = 0;
        this.EventClock = 'onSliderDown';
        this.onSliderMove(-10);
        break;
      }
      default:
        break;
    }
  }, 30);

  /** 音频编辑时发送waveId给视频,获取是否编辑 */
  onEditWaveGraph() {
    PubSub.publish(AppEventNames.WAVE_IS_EDIT, { waveId: this.waveId });
  }

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

  onClickCurrentWave() {
    shortcutKeyDefaultList.forEach((s) => Mousetrap.unbind(s.key));
    shortcutKeyDefaultList.forEach((s) => {
      Mousetrap.bind(s.key, (e: KeyboardEvent) => {
        e.preventDefault();
        this.waveAction({ type: s.type });
      });
    });
  }

  onControlVideo(type: VIDEO_STATUS, params) {
    const { currentTime, speed } = params;
    PubSub.publish(AppEventNames.CONTROL_VIDEO, { type, currentTime, speed, waveFileId: this.props.fileId });
  }
  onClickContextMenuItem(menu, e) {
    e.preventDefault();
    if (menu.type === 'addSign') {
      this.onAddSign();
    } else {
      this.waveAction({ type: menu.type });
    }
  }

  render() {
    const { scanWaveRef, bgWaveRef, mainWaveRef, clientRef, xAxisRef, yAxisRef, scanSliderRef, signRef, smartSignRef, signAreaRef, contextMenuRef } =
      this.domRefs;
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
      fileId,
      onDoubleClickSign,
      showAddBtn = true,
      showSmartSign = true,
      showManualSign = true,
      showSelectArea = true,
      smartSignTitle,
      isSearchVoiceSign,
      contextMenuList
    } = this.props;

    const smartSignList = this.signAll.filter((item) => !item.isManual);
    const manualSignList = this.signAll.filter((item) => item.isManual);

    return isValidFile ? (
      <div className="wave" onClick={this.onClickCurrentWave.bind(this)}>
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
                <canvas
                  className="wave-content-bg ui-h-100"
                  ref={bgWaveRef}
                  id={`bg_wave_${fileId}`}
                  onWheel={this.onWheel}
                  onMouseDown={this.onBgDown}
                  onMouseMove={this.onMainMouseMove}
                />
                {/* <Spin spinning={mainLoading || scanLoading} style={{ height: '100%' }}></Spin> */}
                <canvas className="ui-h-100 flex-1" ref={mainWaveRef} style={{ cursor: 'text' }} />
                <div className="wave-context_menu" ref={contextMenuRef}>
                  {contextMenuList?.map((menu) => (
                    <div key={menu.key} className="wave-context_menu-item" onClick={this.onClickContextMenuItem.bind(this, menu)}>
                      {menu.name} {menu.code}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="wave-bottom" ref={signAreaRef}>
          <canvas className="wave-xAxis" ref={xAxisRef}></canvas>
          <div className="sign-area">
            {/* 智能标注 */}
            <div style={{ position: 'relative', display: showSmartSign ? 'block' : 'none', height: 28 }}>
              <canvas
                ref={smartSignRef}
                className="sign-area-bg"
                title="双击标注可查看更多详情"
                onClick={(e) => this.signClick(e, false)}
                onDoubleClick={(e) => this.signDoubleClick(e, false)}
              />
              <div className="sign-img-contain">
                {smartSignTitle ? (
                  <span>{smartSignTitle}</span>
                ) : (
                  <>
                    智能标注
                    <img src={atlas_label} className="smart_img" title="智能标注" alt="智能标注" />
                  </>
                )}
              </div>
              <Popover
                trigger="click"
                placement="leftBottom"
                overlayClassName="sign_modal"
                visible={smartSignListVisible}
                onVisibleChange={(visible) => this.setState({ smartSignListVisible: visible })}
                // getPopupContainer={() => signAreaRef.current as HTMLElement}
                title={
                  <div className="sign-scroll-event flex just-between">
                    <div className="sign-scroll-event">标注{`（${smartSignList?.length}）`}</div>
                    <div
                      className="sign-scroll-event cursor fz20"
                      title="关闭"
                      style={{ lineHeight: '14px' }}
                      onClick={() => this.setState({ smartSignListVisible: false })}
                    >
                      ×
                    </div>
                  </div>
                }
                content={() => <SignTable isSearchVoiceSign={isSearchVoiceSign} dataSource={smartSignList} />}
              >
                <img
                  src={smartSignListVisible ? more_signclose : more_signopen}
                  className="sign_collapsed"
                  title={smartSignListVisible ? '隐藏标注列表' : '显示标注列表'}
                  alt="标注"
                  onClick={() => {
                    this.setState({ manualSignListVisible: false });
                    this.setState({ smartSignListVisible: !smartSignListVisible });
                  }}
                />
              </Popover>
              <img
                src={smartSignVisible ? atlas_eyesopen : atlas_eyesclose}
                className="visible_img"
                title={smartSignVisible ? '显示智能标注' : '隐藏智能标注'}
                alt="隐藏"
                onClick={this.toggleSmartSign}
              />
              <div className="border" />
            </div>

            {/* 手动标注 */}
            <div style={{ position: 'relative', display: showManualSign ? 'block' : 'none', height: 28 }}>
              <canvas onDoubleClick={this.signDoubleClick} onClick={this.signClick} className="sign-area-bg shou" ref={signRef} />
              <img
                src={signVisible ? atlas_eyesopen : atlas_eyesclose}
                className="visible_img"
                title={signVisible ? '显示' : '隐藏'}
                alt="隐藏"
                onClick={this.toggleSign}
              />
              <Popover
                trigger="click"
                placement="leftBottom"
                style={{ zIndex: 2 }}
                overlayClassName="sign_modal"
                visible={manualSignListVisible}
                onVisibleChange={(visible) => this.setState({ manualSignListVisible: this.props.Global?.showSignEdit || visible })}
                // getPopupContainer={() => signAreaRef.current as HTMLElement}
                title={
                  <div className="sign-scroll-event flex just-between">
                    <div className="sign-scroll-event">{'标注' + `（${manualSignList?.length}）`}</div>
                    <div
                      className="sign-scroll-event cursor fz20"
                      title="关闭"
                      style={{ lineHeight: '14px' }}
                      onClick={() => this.setState({ manualSignListVisible: false })}
                    >
                      ×
                    </div>
                  </div>
                }
                content={() => <SignTable dataSource={manualSignList} onEditSign={onDoubleClickSign} />}
              >
                <img
                  src={manualSignListVisible ? more_signclose : more_signopen}
                  className="sign_collapsed"
                  title={manualSignListVisible ? '隐藏标注列表' : '显示标注列表'}
                  alt="标注"
                  onClick={() => {
                    this.setState({ smartSignListVisible: false });
                    this.setState({ manualSignListVisible: !manualSignListVisible });
                  }}
                />
              </Popover>
            </div>
          </div>
          <div className="play-area">
            <span className="current-time ellipsis">
              {/* {waveUtil.secondsToMinutes(playCurrentTime)} */}
              {showSelectArea ? (
                <span className="mr20">
                  <span className="label-colon">选区</span>
                  {utils.toHHmmss(this.selectStartMs)}-{utils.toHHmmss(this.selectEndMs)}
                </span>
              ) : null}
              <span>
                <span className="label-colon">时长</span>
                {utils.toHHmmss(this.totalMs)}
              </span>
            </span>
            <div className="word-nowrap flex">
              {playing ? (
                <img src={atlas_stop} className="operate_img" title="暂停" alt="暂停" onClick={() => this.pause(playCurrentTime)} />
              ) : (
                <img src={atlas_play} className="operate_img" title="播放" alt="播放" onClick={() => this.play()} />
              )}
              {showAddBtn ? <img src={atlas_sign} className="operate_img ui-ml-10" title="新增标注" alt="新增标注" onClick={this.onAddSign} /> : null}

              <div onClick={(e) => e.stopPropagation()} className="flex">
                <Popover
                  trigger="focus"
                  visible={this.state.playbackRateVisible}
                  overlayClassName="playbackRates"
                  onVisibleChange={(visible) => this.setState({ playbackRateVisible: visible })}
                  // getPopupContainer={(node) => node.parentNode as HTMLElement}
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
                              this.onControlVideo(VIDEO_STATUS.speed, { speed: item.value });
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

            .wave-context_menu {
              background: #081b3a;
              display: none;
              z-index: 888;
              position: fixed;
              top: 755px;
              left: 553px;
              border: 1px solid #009ee9;
            }
            .wave-context_menu .wave-context_menu-item {
              color: #fff;
              cursor: pointer;
              padding: 2px 10px;
              border-bottom: 1px solid rgba(0, 158, 233, 0.3);
            }
            .wave-context_menu .wave-context_menu-item:last-child {
              border-bottom: none;
            }
            .wave-context_menu .wave-context_menu-item:hover {
              color: #009ee9;
              background: #1e366a;
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
