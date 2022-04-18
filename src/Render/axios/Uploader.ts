import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';

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
  fieldID?: string;
  options?: AxiosRequestConfig;
}

class Uploader<T extends { file: File | FormData | string; uuid?: string }> {
  private result: AxiosResponse<any>[] = []; //结果数组
  private taskList: T[] = []; //所有任务队列
  private queue: T[] = []; // 所有待执行任务队列
  private limit = 0; //    限制请求数
  private fieldID = 'uuid'; //唯一字段
  private runningNum = 0; //正在运行的个数
  private _onCancelToken; //取消请求
  private _onProgress; //   进度(仅上传)
  private _onSuccess; //    成功回调
  private _onCatch; //      失败回调
  private _onCancel; //     取消回调
  private _onFinish; //     完成回调
  private Canceler?: Canceler;
  private DefaultOptions: AxiosRequestConfig;

  constructor(fileData: TaskOptionsType<T>, options?: AxiosRequestConfig) {
    const { taskList, limit = 5, fieldID = 'uuid' } = fileData;
    this.taskList = taskList;
    this.limit = limit;
    this.fieldID = fieldID;
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

  /** 处理参数 */
  initParams(file: File | FormData | string) {
    let data = new FormData();
    if (file instanceof String) {
      return;
    }
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
      const uniqueId = this.fieldID || task.uuid;
      axiosInstance
        .request({
          ...this.DefaultOptions,
          cancelToken: new axios.CancelToken((cancel) => {
            this.Canceler = cancel;
            this._onCancelToken && this._onCancelToken(uniqueId, cancel);
          })
        })
        .then((res) => {
          this.result.push(res.data);
          return this._onSuccess && this._onSuccess(uniqueId, res.data);
        })
        .catch((err: Error) => {
          if (axios.isCancel(err)) {
            return this._onCancel && this._onCancel(uniqueId, err);
          }
          return this._onCatch && this._onCatch(uniqueId, err);
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

  /** 请求进度(仅适应于上传) */
  public onProgress(callback?: (uuid: string, progressEvent: ProgressType) => void): this {
    this._onProgress = callback;
    return this;
  }
  /** 返回取消请求回调(用于取消点击项请求) */
  public onCancelToken(callback?: (uuid: string, cancel: Canceler) => void): this {
    this._onCancelToken = callback;
    return this;
  }
  /** 所有任务完成回调 */
  public onFinish<T>(callback?: (response: AxiosResponse<T>[]) => void): this {
    this._onFinish = callback;
    return this;
  }
  /** 单个任务成功回调 */
  public onSuccess<T>(callback?: (uuid: string, response: AxiosResponse<T>) => void): this {
    this._onSuccess = callback;
    return this;
  }
  /** 单个任务失败回调 */
  public onCatch(callback?: (uuid: string, error: Error) => void): this {
    this._onCatch = callback;
    return this;
  }
  /** 取消请求的失败回调 */
  public onCancel(callback?: (uuid: string, cancelError: Error) => void): this {
    this._onCancel = callback;
    return this;
  }
  /** 实例对象取消 */
  cancel(message?: string): void {
    this.Canceler && this.Canceler(message);
    this.Canceler = undefined;
  }
}

export default Uploader;

/**
 * 使用方法
 * dataList: 文件路径列表或文件列表
 *  
 const onStart = (dataList: Array<string | File>) => {
    // 创建任务列表, 一次性上传多个文件 将FormData放循环外接收fd
    const taskList: UploadItemType[] = [];
    for (let i = 0; i < dataList.length; i++) {
      const src = dataList[i];
      let fileName: string = '';
      let file: File;
      if (typeof src === 'string') {
        const fd = new FormData();
        const buffer = readFile(src);
        fileName = path.basename(src);
        const info = fs.statSync(src);
        if (!buffer) return;
        file = new File([buffer], fileName, { type: info.birthtimeMs.toFixed(0) });
        fd.append('file', file);
      } else {
        file = src;
        fileName = src.name;
      }

      // 未获取到文件id前使用uuid
      taskList.push({
        uuid: uuidv4(),
        file_id: 0,
        file_name: fileName,
        file: file,
        progress: 0,
        status: uploadStatus.waiting,
        cancel: undefined
      });
    }
    setItemUploadData((x) => [...taskList, ...x]);
    //3.创建实例调用，设置请求限制数为2
    new Uploader<UploadItemType>({ taskList, limit: 2 }, { timeout: 0 })
      .onCancelToken((uuid: string, cancelToken) => {
        setResult(uploadStatus.pending, uuid, cancelToken);
      })
      .onCancel((uuid: string, cancel) => {
        setResult(uploadStatus.cancel, uuid, cancel);
      })
      .onProgress((uuid: string, progress: ProgressType) => {
        console.log('progress', progress);
        // setProgress(uuid, progress.progress);
      })
      .onSuccess<ResponseType>((uuid: string, res) => {
        setResult(uploadStatus.success, uuid, res);
      })
      .onCatch((uuid: string, err) => {
        setResult(uploadStatus.fail, uuid, err);
      })
      .onFinish<ResponseType>((res) => {
        console.log('onFinish', res);
      });
  };
  
 */
