import './index.less';

import React, { useRef } from 'react';

import { Button } from 'antd';
import path from 'path';
import { useHistory } from 'react-router';

// import Wave, { SignProps } from '@/Render/components/Wave';

let dirName = path.join(__dirname, '../../../../../../public/assets/video/32k.wav');
if (dirName.includes('app.asar') || dirName.includes('app')) {
  dirName = path.join(__dirname, '../../', '../../../../../../public/assets/video/32k.wav');
}

console.log(`dirName`, dirName);
const Wrap: React.FC = () => {
  const { push } = useHistory();
  // const waveRef = useRef<any>(null);

  // const condenseSlice: any[] = [];
  // const showAddBtn = false;
  // const showSmartSign = true;
  // const showManualSign = true;
  // const isResultReload = true;
  // const activeFileId = '12';
  // const voiceInfo: { voiceid: number; voicePath: string; fileName: string } = {
  //   voiceid: 0,
  //   fileName: '14彭辉_1.wav',
  //   voicePath: dirName
  // };

  const getTimes = (totalTime: number) => {};
  const onSelectAreaChange = (start: number, end: number) => {};
  const onWaveFinish = (params) => {};

  return (
    <div className="ui-w-100">
      <Button type="primary" onClick={() => push('/login')}>
        退出
      </Button>
      {/* <Wave
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
        isResultReload={isResultReload}
        onZoomChange={(zoom) => {}}
        zoomRatios={[
          { label: '1.0x', value: 100 },
          { label: '1.2x', value: 120 },
          { label: '2.4x', value: 240 },
          { label: '4.8x', value: 480 },
          { label: '10.0x', value: 1000 },
          { label: '20.0x', value: 2000 }
        ]}
        playbackRates={[
          { label: '0.5x', value: 0.5 },
          { label: '0.75x', value: 0.75 },
          { label: '1.0x', value: 1 },
          { label: '1.5x', value: 1.5 },
          { label: '2.0x', value: 2 }
        ]}
      /> */}
    </div>
  );
};

export default Wrap;
