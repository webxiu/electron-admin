import React, { useEffect, useRef } from 'react';

import { Popover } from 'antd';

interface Props {}

const Component: React.FC<Props> = ({ children }) => {
  const subDom = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    subDom.current && (subDom.current.parentNode! as HTMLDivElement).removeAttribute('title');
  }, []);
  return (
    <>
      <Popover placement="topLeft" content={children}>
        <span ref={subDom}>{children}</span>
      </Popover>
      {/* <style jsx global>{`
        .ant-popover .ant-popover-content .ant-popover-inner {
          background: #1c1c24;
        }
        .ant-popover .ant-popover-content .ant-popover-inner .ant-popover-inner-content {
          color: #fff;
        }
        .ant-popover .ant-popover-content .ant-popover-arrow {
          border-color: #181a1d;
        }
      `}</style> */}
    </>
  );
};

export default React.memo(Component);
