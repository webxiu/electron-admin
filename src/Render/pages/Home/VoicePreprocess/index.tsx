import './index.less';

import { Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

const Wrap: React.FC = () => {
  const { push } = useHistory();
  const { t } = useTranslation('login');

  return (
    <div>
      <Button type="primary" onClick={() => push('/login')}>
        退出
      </Button>
      <div className="aaa">
        ====={t('appName')} ====={t('login')}====
      </div>
      <div className="box">=====css-in-js样式====</div>
      <div className="test">=====less样式====</div>
      <div className="vars">=====var变量样式====</div>
      <div className="flex">=====flex样式====</div>

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
