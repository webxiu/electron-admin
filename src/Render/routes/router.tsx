/**
 * @路由配置规则
 * 一级目录配置为无业务相关的。比如没有没有主窗口或者主窗口不一的
 * 二级目录为业务相关联，比如主要窗口内切换页面
 */

import { LocationState, Path } from 'history';
import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { BaseRouteChange } from './BaseWrap';
import Layout from '~/src/Render/layout';
import RouterWrapNotFound from '@/Render/components/NotFound';
import RouterWrapSpin from '@/Render/components/Spin';

/**
 * @private
 *
 * @全局路由包装组件
 */

const PackingWithAuth: React.FC = ({ children }) => {
  const [changePath, setChangePath] = React.useState({ from: '', to: '' });
  const onChange = (from: string, to: string, next: (path: Path, state?: LocationState) => void) => {
    // if ('登录状态失效') { message.success('登录状态失效，请重新登录'); next('/login') }
    // if (/login/.test(window.location.href)) return;
    // if (!getStorageUserInfo() || !Store.Global.userInfo) {
    //   message.warn('登录状态已失效！请重新登录');
    //   setStorageUserInfo();
    //   window.location.href = '/#/login';
    // }
    setChangePath({ from, to });
  };
  return (
    <BaseRouteChange onChange={onChange}>
      <Suspense fallback={<RouterWrapSpin />}>
        <Switch>
          <Route path="/" exact component={() => <Redirect to="/home" />}></Route>
          <Route path="/login" exact component={lazy(() => import('@/Render/pages/Login'))}></Route>
          {children}
          <Route path="*" component={RouterWrapNotFound}></Route>
        </Switch>
      </Suspense>
    </BaseRouteChange>
  );
};

/**
 * @public
 * @首页路由
 */
export const RootRouter = () => (
  <PackingWithAuth>
    <Layout>
      <Route path="/home" exact component={() => <Redirect to="/home/dashboard" />}></Route>
      <Route path="/home/dashboard" exact component={lazy(() => import('@/Render/pages/Home/Dashboard'))}></Route>
      <Route path="/home/manage" exact component={lazy(() => import('@/Render/pages/Home/Manage'))}></Route>
      <Route path="/home/onestop" exact component={lazy(() => import('@/Render/pages/Home/OneStop'))}></Route>
      <Route path="/home/media" exact component={lazy(() => import('@/Render/pages/Home/Media'))}></Route>
      <Route path="/home/ffmpeg" exact component={lazy(() => import('@/Render/pages/Home/FFmpeg'))}></Route>
    </Layout>
  </PackingWithAuth>
);
