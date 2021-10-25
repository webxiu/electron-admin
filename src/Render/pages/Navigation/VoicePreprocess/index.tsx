import './index.less';

import { Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';

const Wrap: React.FC = () => {
  const { push } = useHistory();
  return (
    <div>
      <Button type="primary" onClick={() => push('/home')}>
        退出
      </Button>
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
