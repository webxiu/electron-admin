import './index.less';

import React, { useEffect, useRef, useState } from 'react';
import Wave, { SignProps } from '@/Render/components/Wave';

import { AppEventNames } from '~/src/Types/EventTypes';
import { Button } from 'antd';
import Mousetrap from 'mousetrap';
import NPlayer from '@/Render/components/NPlayer';
import ShortcutKeyMenu from '@/Render/components/Wave/components/ShortcutKeyMenu';
import WaveHeader from '@/Render/components/Wave/components/WaveHeader';
import path from 'path';
import { shortcutKeyList } from '@/Render/config/wave.config';
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

  const getTimes = (totalTime: number) => {};
  const onSelectAreaChange = (start: number, end: number) => {};
  const onWaveFinish = (params) => {};

  console.log('voiceInfo', voiceInfo);

  /** 注册快捷键 */
  useEffect(() => {
    Mousetrap.bind('ctrl+o', (e) => onWaveHandle('wave_import'));
    Mousetrap.bind('ctrl+e', (e) => onWaveHandle('wave_export'));
    Mousetrap.bind('ctrl+s', (e) => onWaveHandle('wave_save'));
    Mousetrap.bind('ctrl+a', (e) => onWaveHandle('wave_all'));
    Mousetrap.bind('ctrl+x', (e) => onWaveHandle('wave_cut'));
    Mousetrap.bind('ctrl+c', (e) => onWaveHandle('wave_copy'));
    Mousetrap.bind('ctrl+v', (e) => onWaveHandle('wave_paste'));
    Mousetrap.bind('ctrl+z', (e) => onWaveHandle('wave_undo'));
    Mousetrap.bind('right', (e) => onWaveHandle('wave_right'));
    Mousetrap.bind('left', (e) => onWaveHandle('wave_left'));
    Mousetrap.bind('del', (e) => onWaveHandle('wave_delete'));
    Mousetrap.bind('ctrl+n', (e) => onWaveHandle('wave_addSign'));
    Mousetrap.bind('ctrl+m', (e) => onWaveHandle('wave_editSign'));
    Mousetrap.bind('ctrl+del', (e) => onWaveHandle('wave_clear'));
    // Mousetrap.bind('space', (e) => {
    //   e.preventDefault();
    //   onWaveHandle('space');
    // });

    return () => {
      Mousetrap.unbind('ctrl+o'); // 导入
      Mousetrap.unbind('ctrl+e'); // 导出
      Mousetrap.unbind('ctrl+s'); // 保存
      Mousetrap.unbind('ctrl+a'); // 全选
      Mousetrap.unbind('ctrl+x'); // 剪切
      Mousetrap.unbind('ctrl+c'); // 复制
      Mousetrap.unbind('ctrl+v'); // 粘贴
      Mousetrap.unbind('ctrl+z'); // 撤销
      Mousetrap.unbind('right'); //  图谱右移
      Mousetrap.unbind('left'); //   图谱左移
      Mousetrap.unbind('del'); //    删除
      Mousetrap.unbind('ctrl+n'); // 添加标记
      Mousetrap.unbind('ctrl+m'); // 编辑标记
      Mousetrap.unbind('ctrl+del'); // 清空
      // Mousetrap.unbind('space'); //  播放/暂停
    };
  }, []);

  /** @Nav防抖的触发事件 */
  const onWaveHandle = utils.debounce((type: string) => {
    PubSub.publish(AppEventNames.WAVE_ACTION, { activeFileId, type: type });
  }, 500);

  const [zoomRatio, setZoomRatio] = useState<string | number>(100);

  const onZoomRatioChange = (value: number) => {
    waveRef.current?.zoomChange('zoomIn', value);
    setZoomRatio(value);
  };

  return (
    <div className="ui-w-100">
      <div>
        <NPlayer key={0} fileId={0} duration={12} src={videoDirName} images={[previewPic]} />
      </div>
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
        smartSign={condenseSlice}
        showAddBtn={showAddBtn}
        showSmartSign={showSmartSign}
        showManualSign={showManualSign}
        activeFileId={activeFileId}
        fileId={voiceInfo.voiceid}
        filePath={`${voiceInfo.voicePath}`}
        selectArea={{ start_time: 3000, end_time: 8000 }}
        className="grapic"
        onDuration={getTimes}
        onSelectAreaChange={onSelectAreaChange}
        onClickAddSign={() => {
          // setMark({ showMore: false, title: t('addSign') });
          // markRef.current?.open({ content: '' });
        }}
        onDrawMainWaveFinish={onWaveFinish}
        onDoubleClickSign={(item) => {
          // setSelectSign(item);
          // setSelectTime({ startTime: item.startTime, endTime: item.endTime });
          // setMark({ showMore: false, title: t('ViewEdit') });
          // markRef.current?.open({ content: item.name });
        }}
        onDoubleClickSmartSign={(item) => {
          // setSelectSign(item);
          // setMark({ showMore: true, title: t('ViewMore') });
          // markRef.current?.open({ content: item.name, marks: 2 });
        }}
      />
    </div>
  );
};

export default Wrap;
