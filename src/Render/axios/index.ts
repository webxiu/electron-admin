import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { BaseServeResponse } from '~/src/Types/BaseTypes';
import { ResponseErrorDesc } from '@/Render/config/response.config';
import { message } from 'antd';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:5002/',
  timeout: 1000 * 60 * 2,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false
});

/** request过滤器 */
instance.interceptors.request.use(
  (config: AxiosResponse<BaseServeResponse<{}>>) => {
    // config.headers['authorization'] = 'Bearer ' + Date.now() || '';
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

/** response过滤器 */
instance.interceptors.response.use(
  (response) => {
    // 未登录
    if (response.status === 401) {
      message.error('系统超时，请重新登录');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    }
    /** 存在错误 */
    if (response.data.hasError) {
      response.data.errorDesc = ResponseErrorDesc[response.data.errorDesc] || '操作失败';
    }
    return response;
  },
  (err) => {
    /** custom 用于过滤多个上传提示重复 */
    if (axios.isCancel(err) && err.message !== 'custom') {
      message.warn(err.message || '取消成功！');
    }
    if (err?.response?.data?.hasError) {
      err.message = ResponseErrorDesc[err.response.data.errorDesc] || '网络错误';
    }
    return Promise.reject(err);
  }
);

export { AxiosRequestConfig, AxiosResponse };

/** 当需要 终止请求的时候 请求参数使用该方法构造一下，终止时，调用 fn['abort']() 即可 */
export const InjectAbort = (fn: Function, param?: object) => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const _param = $$.isObject(param) ? param : {};
  fn['abort'] = source.cancel;
  return {
    ..._param,
    cancelToken: source.token
  };
};

/** 返回axios实例 */
export default instance;
