import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import type { MenuItemProps, MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';

import { menuItems } from '@/Render/config/menu.config';
import { useObserver } from 'mobx-react';

type MenuItem = Required<MenuProps>['items'][number];

interface Props {}

export const Wrap: React.FC<Props> = (props) => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {}, []);

  return useObserver(() => (
    <div className="flex-col ui-h-100">
      <div className="flex-1">
        <Menu defaultSelectedKeys={['1']} theme="light" defaultOpenKeys={['sub1']} mode="inline" items={menuItems} />
      </div>

      <style jsx>{``}</style>
    </div>
  ));
};

export default Wrap;
