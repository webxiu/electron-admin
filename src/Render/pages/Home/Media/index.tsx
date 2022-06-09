import { AxiosResponse, Canceler, Method } from 'axios';
import React, { useState } from 'react';

import { Button } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Uploader from '@/Render/axios/Request';
import closeIcon from '@/Render/assets/img/icons/close.png';
import information from '@/Render/assets/img/icons/information.png';
import { v4 as uuidv4 } from 'uuid';

export interface UploadItemType {
  /** 文件id */
  uuid: string;
  /** 标题 */
  title: string;
  /** 请求地址 */
  url: string;
  /** 请求方法 */
  method: Method;
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
    color: '#15cc15'
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

  /** 文件路径列表或文件列表 */
  const onSend = () => {
    const renderArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const dataList: UploadItemType[] = renderArr.map((item, i) => {
      return {
        uuid: uuidv4(),
        method: 'GET',
        title: i + '数据接口',
        url: 'https://api.gugudata.com/news/joke/demo',
        status: uploadStatus.waiting
      };
    });
    onStart(dataList);
  };
  /** 文件路径列表或文件列表 */
  const onStart = (taskList: Array<UploadItemType>) => {
    setItemUploadData((x) => [...taskList, ...x]);
    //3.创建实例调用，设置请求限制数为2
    new Uploader<UploadItemType>({ taskList, limit: 2 }, { timeout: 0 })
      .onCancelToken((uuid: string, cancelToken) => {
        setResult(uploadStatus.pending, uuid, cancelToken);
      })
      .onCancel((uuid: string, cancel) => {
        setResult(uploadStatus.cancel, uuid, cancel);
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

  const setResult = (status: uploadStatus, uuid: string, res: AxiosResponse<ResponseType> | Canceler | Error) => {
    setItemUploadData((data) => {
      const _data = [...data];
      return _data.map((item) => {
        if (item.uuid === uuid) {
          item.status = status;
          if (status === uploadStatus.pending) {
            item.cancel = res as Canceler;
          } else if (status === uploadStatus.cancel) {
            const err = res as Error;
            console.log('err', err);
          } else if (status === uploadStatus.success) {
            const success = res as AxiosResponse<ResponseType>;
            console.log('success:uuid', success);
          }
        }
        return item;
      });
    });
  };

  /** @取消上传和清空操作  */
  const onCancel = (item: UploadItemType) => {
    /** @上传中点击则取消请求 */
    if (item.status === uploadStatus.pending) {
      item.cancel && item.cancel();
    } else {
      /** @上传完成删除列表 */
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
      <div>批量上传控制</div>
      <Button onClick={onSend}>开始</Button>
      <Button onClick={() => setItemUploadData([])}>清空</Button>
      <div>
        {ItemUploadData?.map((item, index) => {
          return (
            <div key={item.uuid}>
              <div className="file-list">
                <span title={item.title} className="voice-title ellipsis">
                  {item.title}
                </span>
                <div className="flex align-center">
                  {item.status === uploadStatus.pending ? (
                    <span>
                      <span className="icon-status">{statusObj[item.status].statusText}</span>
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
