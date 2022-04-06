import { Button, Modal, Progress } from 'antd';
import React, { useState } from 'react';

import { AppEventNames } from '~/src/Types/EventTypes';
import PubSub from 'pubsub-js';
import SelectPath from '@/Render/components/DownLoadButton/SelectPath';
import { download } from '@/Render/service';
import fs from 'fs';
import { generateFilePath } from '@/Render/utils/fs';
import { useInject } from '@/Render/components/Hooks';
import utils from '@/Render/utils/index';

export type FileInfoType = { fileId?: number; formPath: string; tempName?: string };

interface StatusInfoType {
  msg: string;
  percent: number;
  status: 'success' | 'normal' | 'exception' | 'active' | undefined;
}

interface Props {
  pathInfo: FileInfoType;
  content?: React.ReactNode;
}

const DownLoadButton: React.FC<Props> = (props) => {
  const { pathInfo, content } = props;
  const initStatus = { percent: 0, msg: '下载中', status: undefined };
  const { Global, Setting } = useInject('Global', 'Setting');
  const [visible, setVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<StatusInfoType>(initStatus);
  const [fileInfo, setFileInfo] = useState<FileInfoType>({ fileId: 0, formPath: '', tempName: '' });
  const [changePath, setChangePath] = useState<string>(Setting.settings.exportPath);
  const [isDownLoad, setIsDownLoad] = useState<boolean>(false);

  React.useEffect(() => {
    setFileInfo(pathInfo);
  }, [pathInfo]);

  /** 获取文件路径 */
  const getSrc = (fielId) => {
    return download({ file_id: fielId })
      .then(({ data }) => data.data?.src)
      .catch((e) => {
        console.error(e);
        return '';
      });
  };

  /** @下载音频 */
  const ExportDocx = async () => {
    const { fileId, formPath, tempName } = fileInfo;
    setIsDownLoad(true);
    let downPath = formPath;
    if (fileId) {
      downPath = (await getSrc(pathInfo.fileId)) || downPath;
    }
    if (!changePath || !tempName) {
      return;
    }
    const idx = tempName.lastIndexOf('.');
    const name = tempName.substring(0, idx);
    const suffix = tempName.substring(idx);
    const toPath = generateFilePath(changePath, name, suffix);
    // 触发导出标记
    PubSub.publish(AppEventNames.EXPORT_MARK, { src: changePath, fileName: tempName, fileId: fileId });
    //设置音频进度
    downLoadFile(downPath, toPath, (res) => setProgress(res));
  };

  /** @关闭下载 */
  const closeDownLoad = () => {
    if (!isDownLoad) {
      setVisible(false);
      return;
    }
    if (progress.percent !== 100) {
      Modal.confirm({
        title: '提示',
        centered: true,
        content: '当前还没有下载完成, 确定要取消吗?',
        onOk: () => {
          setVisible(false);
          setIsDownLoad(false);
          setProgress(initStatus);
          Global.setPauseDownload(true);
        }
      });
    }
  };

  /** @下载进度 */
  const downLoadFile = (formPath: string, toPath: string, callback) => {
    const totalSize = fs.statSync(formPath).size;
    let curSize = 0;
    let percent = 0;
    /** @进度节流处理 */
    const delayfn = utils.throttle((data) => callback(data), 100);
    if (fs.existsSync(formPath)) {
      setVisible(true);
      Global.setPauseDownload(false); // 是否暂停下载
      const rs = fs.createReadStream(formPath, { highWaterMark: 64 * 1024 });
      const ws = fs.createWriteStream(toPath);
      try {
        rs.on('error', (error) => {
          delayfn({ percent, status: 'exception', msg: '下载失败' });
        })
          .on('data', (chunk) => {
            curSize += chunk.length;
            percent = Number(((curSize / totalSize) * 100).toFixed());
            /** 中途取消, 中止下载 */
            if (Global.pauseDownload) {
              rs.destroy();
            }
            if (curSize === totalSize) {
              callback({ percent, status: 'success', msg: '下载完成' });
              const timer = setTimeout(() => {
                setVisible(false);
                setIsDownLoad(false);
                timer && clearTimeout(timer);
                callback({ percent: 0, status: 'normal', msg: '下载中' });
              }, 1000);
            } else {
              delayfn({ percent, status: 'active', msg: '下载中' });
            }
          })
          .pipe(ws);
      } catch (e) {
        callback({ percent, status: 'normal', msg: '文件不存在' });
      }
    }
  };

  return (
    <>
      {content ? (
        <span className="flex just-center align-center ui-ov-h" onClick={() => setVisible(true)}>
          {content}
        </span>
      ) : (
        <Button type="primary" size="small" onClick={() => setVisible(true)}>
          下载
        </Button>
      )}
      <Modal
        title="音频下载"
        visible={visible}
        onCancel={closeDownLoad}
        width="640px"
        centered
        destroyOnClose={true}
        mask={false}
        maskClosable={false}
        footer={null}
      >
        <div style={{ padding: isDownLoad ? '0 20px 30px' : '0 20px' }}>
          {isDownLoad ? null : (
            <div className="flex-col just-center align-center">
              <SelectPath
                title="浏览"
                label="选择存储目录"
                path={changePath}
                boxStyle={{ width: '100%' }}
                onPathChange={(path: string) => setChangePath(path)}
              />
              <Button type="primary" style={{ marginTop: 30 }} onClick={ExportDocx}>
                确定
              </Button>
            </div>
          )}
          <div style={{ display: isDownLoad ? 'block' : 'none' }}>
            <span style={{ color: progress.percent === 100 ? '#52c41a' : '#1890ff' }}>{progress.msg}</span>
            <Progress percent={Number(progress.percent)} status={progress.status} format={(percent) => `${percent}%`} />
          </div>
        </div>
      </Modal>
      <style jsx global>{`
        .ant-progress-text {
          color: #fff;
        }
      `}</style>
    </>
  );
};

export default DownLoadButton;
