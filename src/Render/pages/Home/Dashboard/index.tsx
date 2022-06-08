import './index.less';

import { MarkVoice, OpenType } from '@/Render/components/Wave/components/MarkVoice';
import React, { RefObject, forwardRef, useRef, useState } from 'react';
import Wave, { SignProps } from '@/Render/components/Wave';
import { contextMenuList, shortcutKeyList } from '@/Render/config/wave.config';

import { AppEventNames } from '~/src/Types/EventTypes';
import { Button } from 'antd';
import Mousetrap from 'mousetrap';
import NPlayer from '@/Render/components/NPlayer';
import ShortcutKeyMenu from '@/Render/components/Wave/components/ShortcutKeyMenu';
import WaveHeader from '@/Render/components/Wave/components/WaveHeader';
import path from 'path';
import { useHistory } from 'react-router';
import utils from '@/Render/utils/index';

// import NPlayer from './NPlayer';

let rootPath = path.join(process.cwd(), '/public');
if (rootPath.includes('app.asar') || rootPath.includes('app')) {
  rootPath = path.join(process.cwd(), '/public');
}

const dirName = path.join(rootPath, '/assets/video/cat_wechat.wav');
const videoDirName = path.join(rootPath, '/assets/video/cat_wechat.mp4');
const previewPic = path.join(rootPath, '/assets/video/cat_wechat.jpg');

console.log(`rootPath`, rootPath);
console.log(`dirName`, dirName);
const Wrap: React.FC = () => {
  const { push } = useHistory();
  const waveRef = useRef<any>(null);
  const markRef: RefObject<OpenType> = useRef(null);
  const [selectTime, setSelectTime] = useState({ startTime: 0, endTime: 0 });
  const [selectSign, setSelectSign] = useState<SignProps>({
    startTime: 0,
    endTime: 0,
    name: '',
    id: '',
    isManual: true,
    isVisible: true
  });

  const [mark, setMark] = useState<{ title: string; showMore: boolean }>({
    title: '新增标注',
    showMore: false
  });

  const condenseSlice = [];
  const showAddBtn = false;
  const showSmartSign = true;
  const showManualSign = true;
  const activeFileId = '12';
  const voiceInfo: { voiceid: number; voicePath: string; fileName: string } = {
    voiceid: 0,
    fileName: '14彭辉_1.wav',
    voicePath: dirName
  };

  React.useEffect(() => {
    const actionName = `ADD_SIGN_${voiceInfo.voiceid}`;
    const { startTime, endTime } = selectTime;
    PubSub.subscribe(actionName, (msg: string, data) => {
      if ((!startTime && !endTime) || endTime === startTime) {
        message.error('请选择标注区域！');
        return;
      }
      if (msg === actionName) {
        setMark({ showMore: false, title: '新增标注' });
        markRef.current?.open({ content: '' });
      }
    });
    return () => {
      PubSub.unsubscribe(actionName);
    };
  }, [activeFileId, selectTime, voiceInfo]);

  const getTimes = (totalTime: number) => {};
  const onSelectAreaChange = (start: number, end: number) => {};
  const onWaveFinish = (params) => {};

  console.log('voiceInfo', voiceInfo);

  /** @Nav防抖的触发事件 */
  const onWaveHandle = utils.debounce((type: string) => {
    PubSub.publish(AppEventNames.WAVE_ACTION, { activeFileId, type: type });
  }, 500);

  const [zoomRatio, setZoomRatio] = useState<string | number>(100);

  const onZoomRatioChange = (value: number) => {
    waveRef.current?.zoomChange('zoomIn', value);
    setZoomRatio(value);
  };

  const onClickAddSign = () => {
    setMark({ showMore: false, title: '新增标注' });
    markRef.current?.open({ content: '' });
  };
  const onDoubleClickSign = (item: SignProps) => {
    setSelectSign(item);
    setSelectTime({ startTime: item.startTime, endTime: item.endTime });
    setMark({ showMore: false, title: '查看编辑' });
    markRef.current?.open({ content: item.name });
  };
  const onDoubleClickSmartSign = (item: SignProps) => {
    setSelectSign(item);
    setMark({ showMore: true, title: '查看更多' });
    markRef.current?.open({ content: item.name, marks: 2 });
  };

  const onSubmitSign = (value) => {
    if (mark.title === '新增标注') {
      PubSub.publish(`WAVE_ACTION_${activeFileId}`, { activeFileId, type: 'wave_addSign', name: value.content });
    } else if (mark.title === '查看编辑') {
      PubSub.publish(`WAVE_ACTION_${activeFileId}`, { ...selectSign, activeFileId, type: 'editSign', name: value.content });
    } else if (mark.title === '查看更多') {
      if (value.content) {
        PubSub.publish(`WAVE_ACTION_${activeFileId}`, { activeFileId, type: 'wave_addSign', name: value.content });
      }
    }
    markRef.current?.onCancel();
  };

  const onDeleteSign = () => {
    PubSub.publish(`WAVE_ACTION_${activeFileId}`, { activeFileId, type: 'deleteSign', id: selectSign.id });
    markRef.current?.onCancel();
  };

  const getRegion = () => {
    return {
      start: mark.title === '查看更多' ? selectSign.startTime : selectTime.startTime,
      end: mark.title === '查看更多' ? selectSign.endTime : selectTime.endTime,
      times: mark.title === '查看更多' ? selectSign.endTime - selectSign.startTime : selectTime.endTime - selectTime.startTime,
      name: selectSign.name
    };
  };

  return (
    <div className="flex-col ui-w-100">
      <div className="flex ui-ov-h">
        <NPlayer key={0} fileId={0} duration={12} src={videoDirName} images={[previewPic]} />
      </div>
      <div className="flex-1">
        <ShortcutKeyMenu shortcutKeyList={shortcutKeyList} onWaveHandle={onWaveHandle} />
        <WaveHeader
          zoomRatio={zoomRatio}
          onZoomRatioChange={onZoomRatioChange}
          columnName={{ file_name: '文件名', keyword: '关键词' }}
          columnData={{ file_name: '测力计.wav', keyword: '方法' }}
          downloadInfo={{ fileId: 0, formPath: voiceInfo.voicePath, tempName: '测力计.wav' }}
        />
        <Wave
          ref={waveRef}
          showAddBtn={showAddBtn}
          showSmartSign={showSmartSign}
          showManualSign={showManualSign}
          activeFileId={activeFileId}
          fileId={voiceInfo.voiceid}
          filePath={`${voiceInfo.voicePath}`}
          smartSign={condenseSlice}
          contextMenuList={contextMenuList}
          selectArea={{ start_time: 3000, end_time: 8000 }}
          className="grapic"
          onDuration={getTimes}
          onSelectAreaChange={onSelectAreaChange}
          onClickAddSign={onClickAddSign}
          onDrawMainWaveFinish={onWaveFinish}
          onDoubleClickSign={onDoubleClickSign}
          onDoubleClickSmartSign={onDoubleClickSmartSign}
        />
      </div>
      <MarkVoice ref={markRef} title={mark.title} isShowMore={mark.showMore} region={getRegion()} onDelete={onDeleteSign} onSubmit={onSubmitSign} />
    </div>
  );
};

export default Wrap;
