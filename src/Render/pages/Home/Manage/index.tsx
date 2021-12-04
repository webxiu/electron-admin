import { Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

const Wrap: React.FC = () => {
  const { push } = useHistory();
  const { t } = useTranslation('login');

  const arrList: number[] = [];
  for (let i = 1; i <= 100; i++) {
    arrList.push(i);
  }
  return (
    <div>
      <div>=====应用名称:{t('appName')} ========</div>
      <div className="box">=====css-in-js样式====</div>
      <div className="test">=====less样式====</div>
      <div className="var-css">=====var变量样式====</div>
      <div className="less-var">=====less变量样式====</div>
      <div className="flex">=====define通用样式====</div>
      {arrList.map((item) => (
        <div key={item}>开始====={item}====</div>
      ))}

      <style jsx>{`
        .box {
          background-color: #0f0;
        }
        .var-css {
          background-color: var(--bdc);
        }
      `}</style>
    </div>
  );
};

export default Wrap;
