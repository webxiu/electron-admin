import { Button, Spin, Tooltip } from 'antd';

import React from 'react';
import uploading_blue from '@/Render/assets/img/uploading_blue.png';

interface BaseProps {
  fileRef: React.RefObject<HTMLInputElement>;
}

/** 选择文件 */
export const WarpSelectFileList: React.FC<BaseProps> = (props) => {
  const { fileRef } = props;
  return (
    <div
      onClick={() => {
        fileRef.current?.dispatchEvent(new MouseEvent('click'));
      }}
    >
      <img src={uploading_blue} width="56" height="48" alt="上传文件" />
      <div className="title">上传文件</div>
    </div>
  );
};

interface ResetWarpSelectFileList extends BaseProps {
  fileList: FileList;
}
/** 重新选择 */
export const ResetWarpSelectFileList: React.FC<ResetWarpSelectFileList> = (props) => {
  const { fileRef, fileList } = props;
  const _Flist: File[] = [];
  for (const key in fileList) {
    if (fileList[key] instanceof File) {
      const item = fileList[key];
      _Flist.push(item);
    }
  }
  return (
    <>
      <div>
        {_Flist.map((item, index) => {
          if (index < 2) {
            return (
              <p key={item.name} style={{ margin: '0' }}>
                {item.name}
              </p>
            );
          }
          return null;
        })}
        {_Flist.length > 2 ? (
          <p style={{ textAlign: 'center', margin: '0' }}>
            <Tooltip
              style={{ maxHeight: '300px' }}
              placement="rightBottom"
              title={
                <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                  {_Flist.map((item) => (
                    <p key={item.name} style={{ margin: '0' }}>
                      {item.name}
                    </p>
                  ))}
                </div>
              }
            >
              ...
            </Tooltip>
          </p>
        ) : null}
      </div>

      <br />
      <Button
        size="small"
        type="primary"
        onClick={() => {
          fileRef.current?.dispatchEvent(new MouseEvent('click'));
        }}
      >
        重新上传
      </Button>
    </>
  );
};

/** 重新选择 */
export const FileHandlePending: React.FC<{}> = () => {
  return <Spin tip="正在处理选择文件" />;
};
