import { Button, Input } from 'antd';
import React, { useState } from 'react';

import { AppEventNames } from '~/src/Types/EventTypes';
import { Modal } from '@/Render/components/Antd';
import { PlusOutlined } from '@ant-design/icons';
import ProcedureStep from './ProcedureStep';
import { useHistory } from 'react-router';

const stepList = [
  { name: '语音质量检测', icon: require('@/Render/assets/img/icons/menu_icon1.png').default },
  { name: '有效音检测', icon: require('@/Render/assets/img/icons/menu_icon2.png').default },
  { name: '声纹聚类', icon: require('@/Render/assets/img/icons/menu_icon3.png').default },
  { name: '分组合并', icon: require('@/Render/assets/img/icons/menu_icon3.png').default },
  { name: '分组合并', icon: require('@/Render/assets/img/icons/menu_icon3.png').default }
];

const Wrap: React.FC = () => {
  const { push } = useHistory();
  const [processVisible, setProcessVisible] = useState<boolean>(false);
  const [exportPath, setExportPath] = useState<string>('/C/User/Desktop/New program');

  const changeExportPath = async () => {
    console.log(`11`, 11);
    const dir: string | undefined = await new Promise((resolve) => {
      $$.Event.emit(AppEventNames.OPENDIRECTORY, (DirectoryList: string[] | undefined) => {
        resolve(DirectoryList && DirectoryList.length ? DirectoryList[0] : undefined);
      });
    });
    dir && setExportPath(dir);
  };

  return (
    <div className="setting-wrap ui-h-100">
      <div className="title">设置</div>
      <div className="flex just-between align-center mt40">
        <div className="export-label mr20">文件导出目录</div>
        <div className="flex flex-1">
          <Input readOnly className="read-only-input" value={exportPath} />
          <div className="flex just-between align-center">
            <span className="link-button" onClick={changeExportPath}>
              更改
            </span>
          </div>
        </div>
      </div>
      <div className="flex just-between align-center mt40">
        <div className="export-label mr20">一站式处理流程设置</div>
        <div className="flex flex-1">
          <Button size="small" className="hollow-button" onClick={() => setProcessVisible(true)} icon={<PlusOutlined style={{ fontSize: 12 }} />}>
            新增一站式处理流程
          </Button>
        </div>
      </div>

      <div className="procedure">
        <div className="mt40">
          <ProcedureStep title="社交APP语音处理流程" stepList={stepList} />
          <ProcedureStep title="电话语音处理流程" stepList={stepList} />
          <ProcedureStep title="电话语音处理流程" stepList={stepList} />
        </div>
      </div>

      <Modal
        title="新增处理流程"
        visible={processVisible}
        centered
        width={460}
        onOk={() => {
          console.log(`111`, 111);
        }}
        onCancel={() => setProcessVisible(false)}
      >
        <div>111122222</div>
      </Modal>

      <style jsx>{`
        .setting-wrap {
          background: rgba(37, 37, 37, 0.6);
          border-radius: 4px;
          padding: 24px 50px 0 40px;
        }
        .setting-wrap .title {
          font-family: SourceHanSans-Medium;
          font-size: 16px;
          color: #ffffff;
          line-height: 16px;
          font-weight: 500;
        }
        .setting-wrap .export-label {
          width: 130px;
          font-size: 14px;
          color: #ffffff;
          line-height: 14px;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
};

export default Wrap;
