import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';

import { UploadItemType } from '.';
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

class Upload<T extends UploadItemType> {
  private result: AxiosResponse<any>[] = []; //结果数组
  private taskList: T[] = []; //所有任务队列
  private queue: T[] = []; // 所有待执行任务队列
  private limit = 0; //    限制请求数
  private runningNum = 0; //正在运行的个数
  private _onCancelToken; //请求发起取消
  private _onProgress; //   进度(仅上传)
  private _onSuccess; //    成功回调
  private _onCatch; //      失败回调
  private _onCancel; //     取消回调
  private _onFinish; //     完成回调
  private Canceler?: Canceler;
  private DefaultOptions: AxiosRequestConfig;

  constructor(fileData: TaskOptionsType<T>, options?: AxiosRequestConfig) {
    const { taskList, limit = 5 } = fileData;
    this.taskList = taskList;
    this.limit = limit;
    /** 请求默认选项 */
    this.DefaultOptions = {
      method: 'post',
      url: '/v1/upload',
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        this._onProgress && this._onProgress(this.transformData(progressEvent));
      },
      ...(options ?? {})
    };
    this.preStart();
  }

  // 将所有任务先加入队列
  private preStart = () => {
    const taskList = this.taskList;
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

  initParams(file: File | FormData) {
    let data = new FormData();
    // if (file instanceof FileList) {
    //   Array.prototype.forEach.call(file, (item, index, array) => {
    //     if (file[index] instanceof File) {
    //       data.append(`file${index}`, file[index]);
    //     }
    //   });
    // }
    if (file instanceof File) {
      data.append('file0', file);
    }
    if (file instanceof FormData) {
      data = file;
    }
    this.DefaultOptions.data = data;
  }

  private run() {
    while (this.runningNum < this.limit && this.queue.length) {
      this.runningNum++;
      const task = this.queue.shift();
      if (!task) return;
      this.initParams(task.file);
      axiosInstance
        .request({
          ...this.DefaultOptions,
          cancelToken: new axios.CancelToken((cancel) => {
            this.Canceler = cancel;
            this._onCancelToken && this._onCancelToken(task.uuid, cancel);
          })
        })
        .then((res) => {
          this.result.push(res.data);
          return this._onSuccess && this._onSuccess(task.uuid, res.data);
        })
        .catch((err) => {
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

  public onProgress(callback?: (uuid: string, progressEvent: ProgressType) => void): this {
    this._onProgress = callback;
    return this;
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
  public onCancel(callback?: (uuid: string, cancelError: Canceler) => void): this {
    this._onCancel = callback;
    return this;
  }
  // 实例对象取消
  cancel(message?: string): void {
    this.Canceler && this.Canceler(message);
    this.Canceler = undefined;
  }
}

export default Upload;
