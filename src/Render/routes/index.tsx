import './i18n';

import { ConfigProvider, Radio, message } from 'antd';
import React, { useState } from 'react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

import Config from '~/config';
import { Provider } from 'mobx-react';
import ProviderProps from '@/Render/store/Provider';
import { RootRouter } from './router';
import { Router } from 'react-router';
import { createHashHistory } from 'history';
import en from 'antd/lib/locale-provider/en_US';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

message.config({ top: '50%' as any });

const history = syncHistoryWithStore(createHashHistory({ basename: Config.publicPath }), new RouterStore());
ConfigProvider.config({
  prefixCls: 'custom',
  theme: {
    primaryColor: '#d9db54',
    infoColor: '#727292',
    successColor: '#399d22',
    processingColor: '#0b07ad',
    errorColor: '#dc0303',
    warningColor: '#dc5e17'
  }
});

const R = () => {
  const [prefix, setPrefix] = useState('');

  const handlePrefixChange = (e) => {
    setPrefix(e.target.value);
  };
  return (
    <ConfigProvider locale={LANGUAGE === 'zh_CN' ? zh_CN : en} prefixCls={prefix}>
      <Router history={history}>
        <Radio.Group onChange={handlePrefixChange} value={prefix}>
          <Radio value="ant">Ant Style</Radio>
          <Radio value="custom">Custom Style</Radio>
        </Radio.Group>
        <RootRouter />
      </Router>
    </ConfigProvider>
  );
};
export default (
  <Provider {...ProviderProps}>
    <R />
  </Provider>
);
