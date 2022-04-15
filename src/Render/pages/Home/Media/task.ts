import axios, { Canceler } from 'axios';

import { UploadItemType } from './index';

export enum uploadStatus {
  waiting = 'waiting',
  pending = 'pending',
  success = 'success',
  fail = 'fail',
  cancel = 'cancel'
}

export interface ProgressType {
  progress: number;
  loaded: number;
  total: number;
  timeStamp: number;
}

class TasksHandle<T extends UploadItemType> {
  taskList: T[] = []; //所有任务队列
  queue: T[] = []; //所有待执行任务队列
  result = []; //存储结果的数组
  maxLen = 0; //最大数量
  runningNum = 0; //正在运行的个数
  oneCallback: Function; //单个完成回调
  callback: Function; //所有完成回调
  //tasks：任务，maxLen：限制请求数
  private _onProgress;

  constructor(taskList: T[], maxLen, oneCallback, callback, _onProgress) {
    this.taskList = taskList;
    this.maxLen = maxLen;
    this.oneCallback = oneCallback;
    this.callback = callback;
    this._onProgress = _onProgress;
    this.preStart();
  }
  //运行前函数：将所有任务加入队列
  preStart = () => {
    let taskList = this.taskList;
    taskList.forEach((task) => this.queue.push(task));
    this.run();
  };
  private transformData(e: ProgressEvent): ProgressType {
    return {
      progress: e.total ? Math.floor((e.loaded / e.total) * 100) : 0,
      loaded: e.loaded,
      total: e.total,
      timeStamp: e.timeStamp
    };
  }
  //开始运行
  run() {
    //递归条件：1.当前请求个数小于最大请求数(此时可满足最大请求数为maxLen)
    //         2.当前队列还有请求待执行
    while (this.runningNum < this.maxLen && this.queue.length) {
      // 1.当前请求数增加
      this.runningNum++;
      // 2.队列中取出任务执行
      const task = this.queue.shift();
      //  const api = task?.api()
      axios({
        method: 'get',
        // 默认上报地址
        url: task?.src,
        cancelToken: new axios.CancelToken((cancel) => {
          this.oneCallback('pending', task?.file_id, cancel);
        }),
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          console.log('111', 111);
          this._onProgress && this._onProgress(task?.file_id, this.transformData(progressEvent));
        }
      })
        .then((res) => {
          // 3.成功执行则存入结果数组
          this.result.push(res);
          this.oneCallback(uploadStatus.success, task?.file_id, res.data);
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            this.oneCallback(uploadStatus.cancel, task?.file_id, err);
            return;
          }
          this.oneCallback(uploadStatus.fail, task?.file_id, err);
          // 4.失败则抛出错误
          console.log('err', err);
        })
        .finally(() => {
          //5.无论成功与否，当前请求完成，请求数减一
          this.runningNum--;
          //6.递归调用
          this.run();
        });
    }
    //当所有请求执行完成，调用回调函数
    if (this.runningNum === 0) this.callback(this.result);
  }
}

export default TasksHandle;
