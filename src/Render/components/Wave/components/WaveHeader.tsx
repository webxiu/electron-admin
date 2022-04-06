import DownLoadButton, { FileInfoType } from '@/Render/components/DownLoadButton';
import React, { useEffect, useState } from 'react';

import { Select } from 'antd';
import utils from '@/Render/components/Wave/waveConfig';

export type LabelType = { label: string; value: string | number; field: string };

interface Props<T, U> {
  /** 数据[object] */
  columnData: U;
  /** 名称[object] */
  columnName: T;
  /** 下载音频信息 */
  downloadInfo: FileInfoType;
  /** 缩放比例 */
  zoomRatio: string | number;
  /** 设置缩放比例 */
  onZoomRatioChange: (zoomRatio: number) => void;
  /** 颜色位置 */
  colorPos?: number;
  /** 列样式: 默认宽50% */
  style?: React.CSSProperties;
}

type ComponentProps<T = {}, U = {}> = React.FC<Props<T, U>>;

const WaveHeader: ComponentProps = (props) => {
  const { columnData, columnName, downloadInfo, zoomRatio, onZoomRatioChange, colorPos = -1, style } = props;
  const [descInfoList, setDescInfoList] = useState<LabelType[]>([]);

  useEffect(() => {
    /** 数据组合 */
    const DescribeInfoArr: LabelType[] = Object.keys(columnName).map((key) => ({ label: columnName[key], value: columnData[key], field: key }));
    setDescInfoList(DescribeInfoArr);
  }, [columnData]);

  return (
    <>
      <div className="wave-header" style={style}>
        {descInfoList.map((item, idx) => {
          return (
            <span
              className={`ellipsis fz12 ${idx === colorPos ? 'title-color' : ''}`}
              key={item.field}
              title={(item.label ? item.label + ': ' : '') + item.value}
            >
              {item.label ? <span className="label-colon">{item.label}</span> : null}
              {item.value}
            </span>
          );
        })}
        <div className="flex">
          <div className="mr10 ml20 word-nowrap">
            <span className="label-colon">缩放比</span>
            <Select
              value={zoomRatio}
              onChange={onZoomRatioChange}
              getPopupContainer={(props) => props}
              className="scale-select mr10"
              size="small"
              style={{ width: 80 }}
            >
              {utils.zoomRatios.map((item) => (
                <Select.Option value={item.value} key={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </div>
          <DownLoadButton pathInfo={downloadInfo} />
        </div>
      </div>

      <style jsx>{`
        .wave-header {
          height: 36px;
          padding: 0 5px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #081b3a;
          border: 1px solid rgba(0, 158, 233, 0.3);
        }
        .title-color {
          color: #e99e00;
        }
      `}</style>
    </>
  );
};

export default WaveHeader;
