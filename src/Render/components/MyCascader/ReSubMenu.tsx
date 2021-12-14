import * as CReSubMenu from './ReSubMenu';

import MenuItem from './MenuItem';
import React from 'react';
import SubMenu from './SubMenu';
import { TreeNode } from './config';

interface Props {
  data: TreeNode;
}

const ReSubMenu: React.FC<Props> = (props) => {
  const { data } = props;
  return (
    <SubMenu title={<span>{data.title}</span>}>
      {data.children?.map((c) => {
        if (c.children) {
          return <ReSubMenu key={c.id} data={c} />;
        } else {
          return <MenuItem key={c.id}>{c.title}</MenuItem>;
        }
      })}
      <style jsx global>{`
        .sub-menu {
          position: relative;
        }
        .sub-menu .title {
          line-height: 50px;
          text-align: center;
        }

        .sub-menu .title .icon {
          position: absolute;
          top: 0;
          right: 15px;
        }
        .sub-menu .sub-item {
          position: absolute;
          left: 100%;
          top: 0;
          width: 100%;
          background-color: #f98;
        }
      `}</style>
    </SubMenu>
  );
};

export default ReSubMenu;
