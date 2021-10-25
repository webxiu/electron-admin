import { MobXProviderContext } from 'mobx-react';
import React from 'react';
import Store from '@/Render/store';
import { useLocation } from 'react-router';

type StoreTypes = typeof Store;

/**
 * @useInject 返回类型
 */
type UseInjectBackType<P extends keyof StoreTypes> = { [K in P]: StoreTypes[K] };

/**
 * @注入所有 useInjectAll
 */
export function useInjectAll(): StoreTypes {
  return React.useContext(MobXProviderContext) as StoreTypes;
}

/**
 * @useInject
 * @Mobx 按需注入
 */
export function useInject<P extends keyof StoreTypes>(...storeNames: P[]): UseInjectBackType<P> {
  const ProviderStore = React.useContext(MobXProviderContext);
  const _Store: Partial<UseInjectBackType<P>> = {};
  for (const storeName of storeNames) {
    if (!ProviderStore[storeName]) {
      throw new Error(`${storeName} is not defined`);
    }
    _Store[storeName] = ProviderStore[storeName];
  }
  return _Store as UseInjectBackType<P>;
}

/**
 * @useSearchs
 * @解析search参数
 */
export function useSearchs<S extends { [K in keyof S]?: {} } = {}>(): S {
  const search = useLocation().search;
  const searchObject = {};
  search
    .split('?')[1]
    .split('&')
    .forEach((val) => {
      const kvArray = val.split('=');
      const k = kvArray[0];
      const v = kvArray[1];
      searchObject[k] = v;
    });
  return searchObject as S;
}
