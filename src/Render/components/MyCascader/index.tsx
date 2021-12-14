import React, { useState } from 'react';

import { Input } from 'antd';
import MenuItem from './MenuItem';
import ReSubMenu from './ReSubMenu';
import TreeMenu from './TreeMenu';
import { menu } from './config';

const MyCascader = () => {
  const [visible, setVisible] = useState<boolean>(false);
  window.addEventListener('click', (e) => {
    setVisible(false);
  });
  return (
    <div className="ui-p-r">
      <Input
        onClick={(e) => {
          e.stopPropagation();
          setVisible((x) => !x);
        }}
      />
      <div className="xh-menu" style={{ display: visible ? 'block' : 'none' }}>
        <TreeMenu>
          {menu.map((item) => {
            if (item.children) {
              return <ReSubMenu key={item.id} data={item} />;
            } else {
              return <MenuItem key={item.id}>{item.title}</MenuItem>;
            }
          })}
        </TreeMenu>
        <style jsx global>{`
          .xh-menu {
            width: 160px;
            background: #f60;
            position: absolute;
            line-height: 50%;
            z-index: 999;
          }
        `}</style>
      </div>
    </div>
  );
};

export default MyCascader;
