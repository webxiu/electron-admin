import './i18n';

import { ConfigProvider, message } from 'antd';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

import AutoUpdater from '@/Render/components/AutoUpdater';
import Config from '~/config';
import { Provider } from 'mobx-react';
import ProviderProps from '@/Render/store/Provider';
import React from 'react';
import { RootRouter } from './router';
import { Router } from 'react-router';
import { createHashHistory } from 'history';
import en from 'antd/lib/locale-provider/en_US';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

message.config({ top: '50%' as any });

const history = syncHistoryWithStore(createHashHistory({ basename: Config.publicPath }), new RouterStore());

export default (
  <Provider {...ProviderProps}>
    <ConfigProvider locale={LANGUAGE === 'zh_CN' ? zh_CN : en}>
      <AutoUpdater />
      <Router history={history}>
        <RootRouter />
      </Router>
    </ConfigProvider>
  </Provider>
);
