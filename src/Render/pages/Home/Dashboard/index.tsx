import './index.less';

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
      <Button type="primary" onClick={() => push('/login')}>
        退出
      </Button>
      <div>
        ====={t('appName')} ====={t('login')}====
      </div>
      <div className="box">=====css-in-js样式====</div>
      <div className="test">=====less样式====</div>
      <div className="vars">=====var变量样式====</div>
      <div className="less-var">=====less变量样式====</div>
      <div className="flex">=====flex样式布局====</div>
      {arrList.map((item) => (
        <div key={item}>开始====={item}====</div>
      ))}

      <style jsx>{`
        .box {
          background-color: #0f0;
        }
        .vars {
          background-color: var(--bdc);
        }
      `}</style>
    </div>
  );
};

export default Wrap;
