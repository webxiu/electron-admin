import { Button, DatePicker, Input } from 'antd';

import React from 'react';
import moment from 'moment';
import { useHistory } from 'react-router';

const { RangePicker } = DatePicker;

const Wrap: React.FC = () => {
  const { push } = useHistory();
  return (
    <div>
      <div className="box">
        lfj
        <Button type="primary" onClick={() => push('/login')}>
          退出
        </Button>
        <Input />
      </div>
      <style jsx>{`
        .box {
          background-color: red;
        }
      `}</style>
    </div>
  );
};

export default Wrap;
