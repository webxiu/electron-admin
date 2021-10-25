import { Button } from 'antd';
import React from 'react';

interface Props {
  title: string;
  stepList: { icon: string; name: string }[];
}
const Wrap: React.FC<Props> = (props) => {
  const { title, stepList } = props;
  return (
    <div className="step-wrap">
      <div className="flex just-between align-center">
        <span className="step-title">{title}</span>
        <div>
          <span className="link-button">编辑</span>
          <span className="link-button delete">删除</span>
        </div>
      </div>
      <div className="step-progress flex just-center">
        {stepList.map((item, index) => {
          return (
            <div key={index} className="step-item flex-col just-center align-center">
              <img src={item.name} height={24} width={24} alt="" />
              <span className="step-text">{item.name}</span>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .step-wrap :not(:last-child) {
          margin-bottom: 30px;
        }
        .step-title {
          font-family: SourceHanSans-Normal;
          font-size: 12px;
          color: #ffffff;
          line-height: 12px;
          font-weight: 400;
        }
        .step-progress {
          margin-top: 5px;
          border: 1px solid #3f4041;
          border-radius: 4px;
        }
        .step-item {
          position: relative;
          padding: 10px 15px;
        }
        .step-item:not(:last-child):after {
          content: '';
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border: 4px solid transparent;
          border-left: 4px solid #949495;
        }
        .step-text {
          margin-top: 5px;
          font-size: 12px;
          color: #949495;
          font-weight: 400;
          font-family: SourceHanSans-Normal;
        }
      `}</style>
    </div>
  );
};

export default Wrap;
