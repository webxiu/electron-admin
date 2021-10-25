import { Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';

const Wrap: React.FC = () => {
  const { push } = useHistory();
  return (
    <div>
      <div className="box">
        音频预处理
        <Button type="primary" onClick={() => push('/home')}>
          退出
        </Button>
      </div>
      <style jsx>{`
        .box {
          background-color: #0f0;
        }
      `}</style>
    </div>
  );
};

export default Wrap;
