import Layout from '~/src/Render/layout';
import React from 'react';
import { SwitchViewNavigation } from '@/Render/routes/SwitchView';
import { setWindowSize } from '@/Render/config/index';

export default () => {
  const { width, height } = $$.AppInfo.window;
  setWindowSize(width, height);
  return (
    <Layout>
      <SwitchViewNavigation />
    </Layout>
  );
};
