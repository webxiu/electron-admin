import moment from 'moment';

/** 工具函数 */

export default {
  /**
   * 比较新旧props达到渲染优化
   * @param prevProps memo 中的prev props
   * @param nextProps memo 中的next props
   * @param renderProps 需要刷新渲染的props
   */
  compareProps<P extends object>(prevProps: React.PropsWithChildren<P>, nextProps: React.PropsWithChildren<P>, renderProps: string[]): boolean {
    if (!prevProps || !nextProps) return false;

    for (const propsName of renderProps) {
      const prep = Reflect.get(prevProps, propsName);
      const nexp = Reflect.get(nextProps, propsName);
      if (prep !== nexp) return false;
    }
    return true;
  },

  /**
   * 函数节流
   * @param {Function} func 执行函数
   * @param {number} [delay=0] 延迟时间(ms)
   * @returns {Function} 回调持续节流调用的函数
   * @message 一定时间内只触发一次函数、适用于诸如input事件，当用户输入时需要响应ajax请求，多次input只响应一次回调方法
   */
  throttle(func: Function, delay = 120): (...args: unknown[]) => void {
    let prev = Date.now();
    return (...args) => {
      const now = Date.now();
      if (now - prev >= delay) {
        func.call(null, ...args);
        prev = Date.now();
      }
    };
  },

  /**
   * 函数防抖
   *
   * @param {Function} func 执行函数
   * @param {number} [wait=0] 延迟时间(ms)
   * @returns {Function} 回调防抖函数
   * @message 将几次操作合并为一此操作进行、适用于resize或者鼠标移动事件，防止浏览器频繁响应事件，严重拉低性能
   */
  debounce(func: Function, wait = 120): (...args: unknown[]) => void {
    let timer: NodeJS.Timeout | null = null;
    return (...args) => {
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(func.bind(null, ...args), wait);
    };
  },

  /**
   * 异步函数防重
   *
   * @param {() => Promise<void>} 异步函数func
   * @returns {() => Promise<void>}
   */
  preventDoublePress(func: () => Promise<void>): () => Promise<void> {
    let isPress = false;

    return async () => {
      if (isPress) return;
      isPress = true;
      await func();
      isPress = false;
    };
  },

  /**
   * 函数检测ip和port
   * @returns host 传入的host
   * @returns boolean
   */
  validHost(host: string) {
    // eslint-disable-next-line no-useless-escape
    const reg =
      /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
    return reg.test(host);
  },

  /**
   * 函数检测ip
   * @returns ip 传入的ip
   * @returns boolean
   */
  isValidIP(ip) {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
  },
  /**
   * 时间转时间戳
   * @param time Array 开始时间-结束时间
   * @returns Object 返回时间范围00:00:00 - 23:59:59的毫秒数
   */
  formatRangePicker(time: moment.Moment[]) {
    const begin_time = time?.length ? time[0].startOf('day').valueOf() : 0;
    const end_time = time?.length ? time[1].endOf('day').valueOf() : 0;
    return { begin_time, end_time };
  },

  /**
   * 时间回显处理(将开始时间设置为参数字段)
   * @param storageValue 本地存储的提交参数
   * @param startTimeField 开始时间字段
   * @param endTimeField 结束时间字段
   * @returns antd时间框回显Moment数组与时间提交参数:
   */
  formatRecordTime(params, startTimeField: string, endTimeField: string) {
    let showParams = {}; // 表单回显参数
    let submitParams = {}; // 表单提交参数
    if (params[startTimeField]?.length) {
      const time = params[startTimeField];
      const showTime = [moment(time[0], 'YYYY-MM-DD'), moment(time[1], 'YYYY-MM-DD')];
      const { begin_time, end_time } = this.formatRangePicker([moment(time[0], 'YYYY-MM-DD HH:mm:ss'), moment(time[1], 'YYYY-MM-DD HH:mm:ss')]);
      showParams = {
        [startTimeField]: showTime
      };
      submitParams = {
        [startTimeField]: begin_time,
        [endTimeField]: end_time
      };
    }
    return { showParams, submitParams };
  },

  /**
   * 下载文件
   * @param blob 下载文件blob
   * @param fileName 文件名
   */
  downLoadFile(blob: Blob, fileName: string) {
    const link = document.createElement('a');
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', false, false);
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(link.href);
  },
  /**
   * 获取地址栏参数
   * @param url 地址
   * @returns 参数对象
   */
  getUrlParameters(url: string): any {
    const params = url.match(/([^?=&]+)(=([^&]*))/g) || [];
    const res = params.reduce((a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a), {});
    return res;
  }
};
