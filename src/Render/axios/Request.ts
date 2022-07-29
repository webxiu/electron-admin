import axios, { AxiosRequestConfig, AxiosResponse, Canceler, Method } from 'axios';

import axiosInstance from '@/Render/axios';
import { upload$$Request } from '@/Render/service';

export type UploadFileTypes = File | FileList | FormData | upload$$Request;

export interface ProgressType {
  progress: number;
  loaded: number;
  total: number;
  timeStamp: number;
}

export interface TaskOptionsType<T> {
  taskList: T[];
  limit?: number;
  options?: AxiosRequestConfig;
}

class Request<T extends { uuid?: string; url: string; method?: Method }> {
  private requestOptions: AxiosRequestConfig;
  private result: AxiosResponse<any>[] = []; //结果数组
  private taskList: T[] = []; //所有任务队列
  private taskQueue: T[] = []; // 所有待执行任务队列
  private limit = 0; //    限制请求数
  private runningNum = 0; //正在运行的个数
  private _onCancelToken; //取消请求
  private _onSuccess; //    成功回调
  private _onCatch; //      失败回调
  private _onCancel; //     取消回调
  private _onFinish; //     完成回调
  private Canceler?: Canceler;

  constructor(fileData: TaskOptionsType<T>, options?: AxiosRequestConfig) {
    const { taskList, limit = 5 } = fileData;
    this.taskList = taskList;
    this.limit = limit;
    this.requestOptions = options ?? {};
    this.preStart();
  }

  // 将所有任务先加入队列
  private preStart = () => {
    const taskList = this.taskList;
    taskList.forEach((task) => this.taskQueue.push(task));
    this.run();
  };

  private run() {
    while (this.runningNum < this.limit && this.taskQueue.length) {
      this.runningNum++;
      const task = this.taskQueue.shift();
      if (!task) return;
      axiosInstance
        .request({
          url: task.url,
          method: task.method,
          cancelToken: new axios.CancelToken((cancel) => {
            this.Canceler = cancel;
            this._onCancelToken && this._onCancelToken(task.uuid, cancel);
          }),
          ...this.requestOptions
        })
        .then((res) => {
          this.result.push(res.data);
          return this._onSuccess && this._onSuccess(task.uuid, res.data);
        })
        .catch((err: Error) => {
          if (axios.isCancel(err)) {
            return this._onCancel && this._onCancel(task.uuid, err);
          }
          return this._onCatch && this._onCatch(task.uuid, err);
        })
        .finally(() => {
          this.runningNum--;
          this.run();
        });
    }
    //当所有请求执行完成，调用回调函数
    if (this.runningNum === 0) {
      this._onFinish && this._onFinish(this.result);
    }
  }

  public onCancelToken(callback?: (uuid: string, cancel: Canceler) => void): this {
    this._onCancelToken = callback;
    return this;
  }
  public onFinish<T>(callback?: (response: AxiosResponse<T>[]) => void): this {
    this._onFinish = callback;
    return this;
  }
  public onSuccess<T>(callback?: (uuid: string, response: AxiosResponse<T>) => void): this {
    this._onSuccess = callback;
    return this;
  }
  public onCatch(callback?: (uuid: string, error: Error) => void): this {
    this._onCatch = callback;
    return this;
  }
  public onCancel(callback?: (uuid: string, cancelError: Error) => void): this {
    this._onCancel = callback;
    return this;
  }
  cancel(message?: string): void {
    this.Canceler && this.Canceler(message);
    this.Canceler = undefined;
  }
}

export default Request;
