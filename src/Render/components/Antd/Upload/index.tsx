import { FileHandlePending, ResetWarpSelectFileList, WarpSelectFileList } from './component';
import { Modal, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

import FileProgressRequest from '@/Render/axios/Uploader';

// const ACCEPT_FILE_TYPE = '.wav,.mp3,.aac,.ac3,.ape,.flac,.aiff,.m4a,.mp2,.wma,.amr,.silk,.slk,.flv,.mov,.m4v,.avi,.mkv,.mp4,.mpg,.swf,.vob,.wmv';
const ACCEPT_FILE_TYPE = '.wav';

type AppOnFileChange = { filelist?: FileList | null; fileIdList?: string[] };

const noop = () => {};

interface BaseProps {
  onChange?: (e: AppOnFileChange) => void;
  style?: React.CSSProperties;
  /** 自动上传 */
  autoUpload?: boolean;
  /** 多选文件 */
  multiple?: boolean;
  /** 多选最多可选音频数 */
  max?: number;
}

export const Upload: React.FC<BaseProps> = (props) => {
  const { onChange = noop } = props;
  const [selectFileMaxNumber] = useState<number>(props.multiple ? props.max || 200 : 1);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const inputEle = useRef<HTMLInputElement>(null);

  const verifyFile = (files: any): boolean => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 200 * 1024 * 1024) {
        message.error('单个上传文件大于200M!');
        return false;
      } else if (!/\.wav$/.test(file.name)) {
        message.error('文件格式不正确!');
        return false;
      } else if (file.size < 10 * 1024) {
        message.error('单个上传文件小于10KB!');
        return false;
      }
    }
    return true;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _f = e?.target?.files;
    /** 多选，限制选择数量 */
    if (!!props.multiple && _f!.length > selectFileMaxNumber) {
      Modal.error({ className: 'app-modal', title: '选择文件', content: '选择文件数量不能大于 200 条' });
      e.target.value = '';
      e.target.files = null;
      return;
    }
    if (!verifyFile(_f)) return;
    /** 取消选择，或者没有选择文件时，保留上次选择的结果 */
    if (!_f || !_f.length) {
      return;
    }
    setFileList(_f);
    if (!props.autoUpload) {
      onChange({ filelist: _f });
    }
  };

  useEffect(() => {
    if (!fileList || !fileList.length || !props.autoUpload) return;
    setUploadLoading(true);
    const fileRequest = new FileProgressRequest(fileList);
    fileRequest
      .upload()
      .onSuccess((res) => {
        setUploadLoading(false);
        console.log('response', res, res.data);
        // onChange({ filelist: fileList, fileIdList: res.data.file_id_list });
      })
      .onCatch((err) => {
        console.log('error', err);
        setUploadLoading(false);
        setFileList(null);
        console.error('文件上传失败', err);
        message.error('文件上传失败' + err.message);
        if (inputEle.current) {
          inputEle.current.value = '';
          inputEle.current.files = null;
        }
      });
  }, [fileList]);

  const RenderAssets: React.FC<{}> = () => {
    if (!fileList || !fileList.length) {
      return <WarpSelectFileList fileRef={inputEle} />;
    }
    if (uploadLoading) {
      return <FileHandlePending />;
    }
    return <ResetWarpSelectFileList fileRef={inputEle} fileList={fileList} />;
  };

  return (
    <div className="upload-wrap" style={props.style ? props.style : {}}>
      <input ref={inputEle} type="file" multiple={!!props.multiple} accept={ACCEPT_FILE_TYPE} onChange={onFileChange} />
      <div className="select-lib-container">
        <RenderAssets />
      </div>
      <style jsx>{`
        .upload-wrap {
          position: relative;
        }
        .upload-wrap > input {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};
