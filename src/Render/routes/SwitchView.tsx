/**
 * @路由配置规则
 * 一级目录配置为无业务相关的。比如没有没有主窗口或者主窗口不一的
 * 二级目录为业务相关联，比如主要窗口内切换页面
 */

import { LocationState, Path } from 'history';
import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { BaseRouteChange } from './BaseWrap';
import RouterWrapNotFound from '@/Render/components/NotFound';
import RouterWrapPages from '@/Render/pages/index';
import RouterWrapSpin from '@/Render/components/Spin';

/**
 * @private
 *
 * @全局路由包装组件
 */

const PackingWithAuth: React.FC = ({ children }) => {
  const onChange = (from: string, to: string, next: (path: Path, state?: LocationState) => void) => {
    // if ('登录状态失效') { message.success('登录状态失效，请重新登录'); next('/login') }
  };
  return (
    <BaseRouteChange onChange={onChange}>
      <Suspense fallback={<RouterWrapSpin />}>
        <Switch>
          {children}
          <Route path="*" component={RouterWrapNotFound}></Route>
        </Switch>
      </Suspense>
    </BaseRouteChange>
  );
};

/**
 * @public
 *
 * @全局一级路由
 */
export const SwitchViewRoot = () => (
  <PackingWithAuth>
    <Route path="/" exact component={RouterWrapPages}></Route>
    <Route path="/home" component={lazy(() => import('@/Render/pages/Home'))}></Route>
    <Route path="/navigation" component={lazy(() => import('@/Render/pages/Navigation'))}></Route>
  </PackingWithAuth>
);

/**
 * @public
 *
 * @Todo二级级路由
 */
export const SwitchViewNavigation = () => (
  <PackingWithAuth>
    <Route path="/navigation/" exact component={() => <Redirect to="/navigation/preprocess" />}></Route>
    <Route path="/navigation/preprocess" exact component={lazy(() => import('@/Render/pages/Navigation/VoicePreprocess'))}></Route>
    <Route path="/navigation/cluster" exact component={lazy(() => import('@/Render/pages/Navigation/VoiceprintCluster'))}></Route>
    <Route path="/navigation/onestop" exact component={lazy(() => import('@/Render/pages/Navigation/OneStopProcess'))}></Route>
  </PackingWithAuth>
);
