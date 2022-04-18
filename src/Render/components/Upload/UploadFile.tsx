import React, { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { Button } from 'antd';

interface Props {
  /** 按钮名称 */
  title?: React.ReactNode | string;
  /** 是否多选文件 */
  multiple: boolean;
  /** 过滤上传文件 */
  accept: string[];
  /** 是否选择目录上传 */
  isDir?: boolean;
  /** 选择完成 */
  onChange: (files: File[], fd: FormData, callback: (res?: 'success' | 'error') => void) => void;
  /** 是否显示上传按钮 */
  showButton?: boolean;
  ref?: unknown;
  className?: string;
  style?: React.CSSProperties;
}

const UploadFile: FC<Props> = forwardRef((props, ref) => {
  const { multiple, accept, isDir = false, onChange, title = '上传文件', className, style, showButton = true } = props;
  const inputEle = useRef<HTMLInputElement>(null);
  const acceptDoc: string = accept.join(',');
  const [loading, setLoading] = useState<boolean>(false);

  useImperativeHandle(ref, () => inputEle.current);

  useEffect(() => {
    if (isDir) {
      inputEle.current?.setAttribute('webkitdirectory', '');
    } else {
      inputEle.current?.removeAttribute('webkitdirectory');
    }
  }, [isDir]);

  const onSelectFile = () => {
    if (loading) return;
    inputEle.current?.dispatchEvent(new MouseEvent('click'));
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const fileArr: File[] = [];
    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const index = file.name.lastIndexOf('.');
      const suffix = file.name.substring(index);

      /** 过滤不符合文件 */
      if (accept.includes(suffix)) {
        fileArr.push(file);
        fd.append(`file${i}`, file);
      }
    }
    setLoading(true);
    onChange(fileArr, fd, () => {
      setLoading(false);
    });
    if (inputEle.current) inputEle.current.value = '';
  };

  return (
    <React.Fragment>
      <div onClick={onSelectFile} style={{ display: showButton ? 'inline-block' : 'none', cursor: 'pointer' }}>
        {typeof title === 'string' ? (
          <Button type="primary" loading={loading} className={className} style={style}>
            {title}
          </Button>
        ) : (
          title
        )}
      </div>
      <input style={{ display: 'none' }} ref={inputEle} type="file" multiple={multiple} accept={acceptDoc} onChange={onFileChange} />
    </React.Fragment>
  );
});

export default UploadFile;
