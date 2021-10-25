import React from 'react';
import nodata from '@/Render/assets/img/icons/nodata.png';

interface Props {
  emptyText?: string;
  style?: object;
}
const Nodata: React.FC<Props> = React.memo((props) => {
  const { emptyText = '暂无数据', style } = props;
  return (
    <div className="no-data">
      <img src={nodata} alt="" />
      <div className="nodata-text" style={style}>
        {emptyText}
      </div>
      <style jsx>{`
        .no-data {
          text-align: center;
        }
        .nodata-text {
          color: #236d90;
        }
      `}</style>
    </div>
  );
});

export default Nodata;
