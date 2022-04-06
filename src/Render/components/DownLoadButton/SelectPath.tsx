import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';

import { AppEventNames } from '~/src/Types/EventTypes';
import { remote } from 'electron';

interface Props {
  label?: string;
  path: string;
  type?: 'open' | 'change';
  tipText?: string;
  className?: string;
  placeholder?: string;
  labelWidth?: number;
  title: string | JSX.Element;
  style?: React.CSSProperties;
  boxStyle?: React.CSSProperties;
  onPathChange: (path: string) => void;
}
const SelectPath: React.FC<Props> = (props) => {
  const { label, path, type = 'change', tipText, title, placeholder = `请选择${label}`, onPathChange, style, boxStyle, className, labelWidth = 'auto' } = props;
  const [filePath, setFilePath] = useState<string>('');

  useEffect(() => {
    setFilePath(path);
  }, [path]);

  const changeExportPath = async () => {
    if (type === 'open') {
      remote.shell.showItemInFolder(path);
      return;
    }
    const dir: string | undefined = await new Promise((resolve) => {
      $$.Event.emit(AppEventNames.OPENDIRECTORY, (DirectoryList: string[] | undefined) => {
        resolve(DirectoryList && DirectoryList.length ? DirectoryList[0] : undefined);
      });
    });
    if (!dir) return;
    setFilePath(dir);
    onPathChange(dir);
  };

  return (
    <div className="flex just-between align-start" style={boxStyle}>
      <div className="path-label" style={{ minWidth: labelWidth }}>
        {label}
      </div>
      <div className="flex-1">
        <div className="flex flex-1 flex-start just-between">
          <div className="flex-1 flex-col">
            <Input readOnly value={filePath} placeholder={placeholder} title={filePath} className="read-only-input" />
            {tipText ? <span className="tips">{tipText}</span> : null}
          </div>
          <div className="flex just-between">
            <Button className={` ${className}`} onClick={changeExportPath} style={{ ...style, marginLeft: 15 }}>
              {title}
            </Button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .path-label {
          margin-right: 20px;
          margin-top: 6px;
        }
        .tips {
          color: #6b6b6b;
          padding-top: 4px;
        }
      `}</style>
    </div>
  );
};
export default SelectPath;
