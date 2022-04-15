import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';

import { useDebounce } from '@/Render/hooks';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

const Wrap: React.FC = () => {
  const { push } = useHistory();
  const { t } = useTranslation('login');

  const [text, setText] = useState('Hello');
  const [value] = useDebounce(text, 2000);

  return (
    <div>
      <div>=====应用名称:{t('appName')} ========</div>
      <div className="box">=====css-in-js样式====</div>
      <div className="test">=====less样式====</div>
      <div className="var-css">=====var变量样式====</div>
      <div className="less-var">=====less变量样式====</div>
      <div className="flex">=====define通用样式====</div>
      <hr />
      <div className="test-bgc" style={{ width: 200, height: 200 }}></div>
      <hr />

      <Input
        defaultValue={'Hello'}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <p>Value: {text}</p>
      <p>Debounced value: {value}</p>
      <Button>风口浪尖</Button>
      <hr />

      <style jsx global>{``}</style>
    </div>
  );
};

export default Wrap;
