import './index.less';

import React, { useEffect, useRef } from 'react';
import Wave, { SignProps } from '@/Render/components/Wave';

import { AppEventNames } from '~/src/Types/EventTypes';
import { Button } from 'antd';
import Mousetrap from 'mousetrap';
import path from 'path';
import { useHistory } from 'react-router';
import utils from '@/Render/utils/index';
import { waveOptions } from '@/Render/config/wave.config';

let dirName = path.join(process.cwd(), '/public/assets/video/32k.wav');
if (dirName.includes('app.asar') || dirName.includes('app')) {
  dirName = path.join(process.cwd(), '/public/assets/video/32k.wav');
}

console.log(`dirName`, dirName);
const Wrap: React.FC = () => {
  const { push } = useHistory();
  const waveRef = useRef(null);

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

  return (
    <div className="ui-w-100">
      <div className="flex">
        {waveOptions.map((item) => {
          return (
            <div key={item.key} className="flex-col just-center align-center cursor mr20" onClick={() => onWaveHandle(item.key)}>
              <img width="16" src={item.icon} alt="" />
              <p>{item.title}</p>
            </div>
          );
        })}
      </div>
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
