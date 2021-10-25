import { Radio, Space, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';

import Header from '@/Render/layout/Navigation/Header';
import Setting from './Setting';
import Start from './Start';
import { get } from '@/Render/service/index';
import { setWindowSize } from '@/Render/config/window.config';

const { TabPane } = Tabs;

type OperateType = 'start' | 'setting';

const Wrap: React.FC = () => {
  const { minWidth, minHeight } = $$.AppInfo.window;
  setWindowSize(minWidth, minHeight, true);
  const [activeKey, setActiveKey] = useState<OperateType>('start');

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <div className="flex-col ui-h-100">
      <Header showMaximize={false}>
        <div className="flex align-center ui-h-100">
          <span className="app-name">
            {$$.AppInfo.appName}v{$$.AppInfo.versions.appVersion}
          </span>
        </div>
      </Header>
      <div className="flex-1 start-page">
        <Tabs tabPosition={'left'} activeKey={activeKey} onChange={(value: OperateType) => setActiveKey(value)}>
          <TabPane tab="开始" key="start">
            <Start />
          </TabPane>
          <TabPane tab="设置" key="setting">
            <Setting />
          </TabPane>
        </Tabs>
        <style jsx global>{`
          .app-name {
            font-family: SourceHanSans-Normal;
            font-size: 14px;
            color: #bbbbbb;
            line-height: 14px;
            font-weight: 400;
            padding-left: 10px;
          }
          .start-page {
            padding: 24px 15px 30px;
            color: #fff;
            background-color: #1b1b1b;
            overflow: auto;
          }

          .start-page .ant-tabs {
            height: 100%;
          }
          .start-page .ant-tabs-tab {
            width: 136px;
            margin: 0 !important;
            padding: 8px 0 !important;
            text-align: left !important;
          }
          .start-page .ant-tabs-content {
            height: 100%;
          }
          .start-page .ant-tabs-tab-btn {
            font-family: SourceHanSans-Normal;
            font-size: 16px;
            color: #ffffff;
            font-weight: 400;
            width: 100%;
            padding: 5px 0 7px 10px;
          }
          .start-page .ant-tabs-ink-bar {
            display: none;
          }
          .start-page .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #fff;
          }
          .start-page .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
            background: #252525;
            border-radius: 4px;
          }
          /** 内容 */
          .start-page .ant-tabs-content-holder {
            color: #fff;
            border-left: none;
            overflow: auto;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Wrap;
