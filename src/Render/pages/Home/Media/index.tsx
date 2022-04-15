import React, { useState } from 'react';
import TasksHandle, { ProgressType } from './Upload';

import { AudioSuffix } from '@/Render/config/common';
import { Button } from 'antd';
import { Canceler } from 'axios';
import { SyncOutlined } from '@ant-design/icons';
import closeIcon from '@/Render/assets/img/icons/close.png';
import fs from 'fs';
import information from '@/Render/assets/img/icons/information.png';
import path from 'path';
import { readFile } from '@/Render/utils/fs';
import { remote } from 'electron';
import { v4 as uuidv4 } from 'uuid';

export interface UploadItemType {
  /** 文件id */
  uuid: string;
  /** 文件id */
  file_id: number;
  /** 文件id */
  file_name: string;
  /** 文件路径文件名 */
  file: File | FormData;
  /** 文件上传进度 */
  progress: number;
  /** 成功/失败状态 */
  status: uploadStatus;
  /** 取消方法 */
  cancel?: (message?: string) => void;
}

export enum uploadStatus {
  waiting = 'waiting',
  pending = 'pending',
  success = 'success',
  fail = 'fail',
  cancel = 'cancel'
}

const statusObj = {
  [uploadStatus.waiting]: {
    statusText: '等待上传',
    color: '#40a9ff'
  },
  [uploadStatus.pending]: {
    statusText: '上传中...',
    color: '#fff'
  },
  [uploadStatus.success]: {
    statusText: '上传成功',
    color: '#0f0'
  },
  [uploadStatus.fail]: {
    statusText: '上传失败',
    color: '#f00'
  },
  [uploadStatus.cancel]: {
    statusText: '取消上传',
    color: '#f60'
  }
};

type ResponseType = {
  Data: any[];
  DataStatus: object;
};

const Media = () => {
  const [ItemUploadData, setItemUploadData] = useState<UploadItemType[]>([]);
  const dataList = [
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo',
    'https://api.gugudata.com/news/joke/demo'
  ];

  /** @单击上传文件 */
  const changeUpload = (e) => {
    const mul = true;
    remote.dialog
      .showOpenDialog({
        properties: mul ? ['openFile', 'multiSelections'] : ['openFile'],
        filters: [{ name: 'file', extensions: AudioSuffix }]
      })
      .then(async ({ canceled, filePaths }) => {
        if (canceled) return;
        onStart(filePaths);
      });
  };
  const onStart = (dataList: string[]) => {
    // 创建任务列表, 一次性上传多个文件 将FormData放循环外接收fd
    const taskList: UploadItemType[] = [];
    for (let i = 0; i < dataList.length; i++) {
      const src = dataList[i];
      const fd = new FormData();
      const buffer = readFile(src);
      const fileName = path.basename(src);
      const info = fs.statSync(src);
      if (!buffer) return;
      const file = new File([buffer], fileName, {
        type: info.birthtimeMs.toFixed(0)
      });
      fd.append('file', file);

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
    //3.创建实例调用，设置请求限制数为5
    new TasksHandle<UploadItemType>({ taskList, limit: 5 }, { timeout: 0 })
      .onCancelToken((uuid: string, cancelToken) => {
        setCancelToken(uploadStatus.pending, uuid, cancelToken);
      })
      .onCancel((uuid: string, cancel) => {
        setCancel(uploadStatus.cancel, uuid, cancel);
      })
      .onProgress((uuid: string, progress: ProgressType) => {
        console.log('progress', progress);
        // setProgress(uuid, progress.progress);
      })
      .onSuccess((uuid: string, res) => {
        setResult(uploadStatus.success, uuid, res);
      })
      .onCatch((uuid: string, err) => {
        setResult(uploadStatus.fail, uuid, err);
      })
      .onFinish<ResponseType>((res) => {
        console.log('onFinish', res);
      });
  };

  /** @设置进度 */
  const setProgress = (uuid: string, progress: number) => {
    setItemUploadData((data) => {
      return data.map((item) => {
        if (item.uuid === uuid) {
          item.progress = progress;
        }
        return item;
      });
    });
  };

  const setResult = (status: uploadStatus, uuid: string, res) => {
    setItemUploadData((data) => {
      return data.map((item) => {
        if (item.uuid === uuid) {
          item.status = status;
          console.log('uuid status', status);
          // item.file_id = res
        }
        return item;
      });
    });
  };
  const setCancelToken = (status: uploadStatus, uuid: string, cancel: Canceler) => {
    setItemUploadData((data) => {
      const _data = [...data];
      return _data.map((item) => {
        if (item.uuid === uuid) {
          item.cancel = cancel;
          item.status = status;
        }
        return item;
      });
    });
  };
  const setCancel = (status: uploadStatus, uuid: string, err) => {
    setItemUploadData((data) => {
      const _data = [...data];
      return _data.map((item) => {
        if (item.uuid === uuid) {
          item.status = status;
        }
        return item;
      });
    });
  };

  /** @取消上传和清空操作  */
  const onCancel = (item: UploadItemType) => {
    /** @上传中点击 取消, 则取消请求 */
    if (item.status === uploadStatus.pending) {
      item.cancel && item.cancel();
    } else {
      /** @上传完成  删除列表 */
      removeItem(item.uuid);
    }
  };

  /** @删除  */
  const removeItem = (uuid) => {
    setItemUploadData((data) => {
      const filterArr = data.filter((k) => k.uuid !== uuid);
      return filterArr;
    });
  };

  return (
    <div>
      Media
      <Button onClick={changeUpload}>上传</Button>
      <Button onClick={() => onStart(dataList)}>开始</Button>
      <Button onClick={() => setItemUploadData([])}>清空</Button>
      <div>
        {ItemUploadData?.map((item, index) => {
          return (
            <div key={item.uuid}>
              <div className="file-list">
                <span title={item.file_name} className="voice-title ellipsis">
                  {item.file_name}
                </span>
                <div className="flex align-center">
                  {item.status === uploadStatus.pending ? (
                    <span>
                      <span className="icon-status">
                        {statusObj[item.status].statusText}
                        {item.progress}%
                      </span>
                      <SyncOutlined spin className="icon-status" />
                    </span>
                  ) : (
                    <>
                      <span style={{ color: statusObj[item.status].color }}>{statusObj[item.status].statusText}</span>
                      <img src={information} title="音频详情" alt="" width={13} height={13} className="ml5 cursor" onClick={() => {}} />
                    </>
                  )}
                  <img src={closeIcon} alt="" title="删除" width={14} height={14} className="ml5 cursor" onClick={onCancel.bind(null, item)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style jsx global>{`
        .search-title {
          font-size: 16px;
          color: #009ee9;
          line-height: 34px;
        }
        .upload-wrap {
          background: #051b37;
          border-radius: 8px;
          padding-bottom: 5px;
        }

        .upload-button {
          position: relative;
          text-align: center;
          box-sizing: border-box;
          padding: 5px 0;
          margin-bottom: 5px;
          border: 2px dotted transparent;
        }
        .upload-button .drag-upload {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 999;
        }
        .upload-text {
          font-size: 14px;
          color: #ffffff;
          letter-spacing: 0;
          text-align: center;
          line-height: 30px;
        }

        .upload-list {
          padding: 0 5px 0 8px;
          overflow-y: auto;
          max-height: 124px;
          margin-bottom: 5px;
        }
        .upload-list.border {
          border: 1px solid #18346c;
          border-radius: 8px;
        }
        .file-list {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          height: 20px;
          line-height: 20px;
          white-space: nowrap;
          overflow: hidden;
          margin: 3px 0;
        }
        .voice-title {
          flex: 1;
          margin: 0 5px;
          font-family: PingFangSC-Medium;
          position: relative;
          color: #fff;
        }
        .status-text {
          margin-right: 14px;
        }

        .icon-status {
          margin-left: 5px;
          color: var(--info-iconc);
          font-size: 13px;
        }
        .change-error {
          color: var(--errc);
          font-size: 12px;
        }
        .upload-submit {
          border-top: 1px solid #0f2757;
          padding: 10px 10px 0 10px;
        }

        .upload-tips {
          padding: 10px 0;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #0f2757;
        }
        .tips-icon {
          height: 14px;
          margin-top: 1px;
        }
        .tips-text {
          margin-left: 5px;
          font-size: 12px;
          color: #fff;
          line-height: 16px;
        }
        .function {
          display: flex;
          align-items: center;
        }
        .function-title {
          margin: 0 10px 0 20px;
        }

        .split-line {
          border-top: 1px solid #0f2757;
          margin: 0px 8px 0 8px;
          padding: 12px 0 0;
        }

        .search-wrap .ant-checkbox-group {
          width: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default Media;
