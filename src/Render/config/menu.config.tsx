import {
  ApartmentOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SettingOutlined
} from '@ant-design/icons';

import type { MenuProps } from 'antd';
import React from 'react';

type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: MenuItem[] = [
  {
    label: <a href="/#/home/dashboard">首页</a>,
    key: 'dashboard',
    icon: <MailOutlined />,
    type: undefined
  },
  {
    label: <a href="/#/home/manage">管理</a>,
    key: 'manage',
    icon: <DesktopOutlined />,
    type: undefined
  },
  {
    label: <a href="/#/home/onestop">一站式</a>,
    key: 'onestop',
    icon: <AppstoreOutlined />,
    type: undefined
  },
  {
    label: <a href="/#/home/media">媒体</a>,
    key: 'media',
    icon: <SettingOutlined />,
    type: undefined
  },
  {
    label: <a href="/#/home/stretch">布局</a>,
    key: 'stretch',
    icon: <PieChartOutlined />,
    type: undefined
  },
  {
    label: <a href="/#/home/flowchart">流程图</a>,
    key: 'flowchart',
    icon: <ApartmentOutlined />,
    type: undefined
  },
  {
    label: '测试展开',
    key: 'test',
    icon: <ContainerOutlined />,
    type: undefined,
    children: [
      { key: '5', label: 'Option 5', icon: undefined, children: undefined, type: undefined },
      { key: '6', label: 'Option 6', icon: undefined, children: undefined, type: undefined },
      { key: '7', label: 'Option 7', icon: undefined, children: undefined, type: undefined },
      {
        key: 'sub33',
        label: '二级菜单2',
        icon: undefined,
        type: undefined,
        children: [
          { key: '8', icon: undefined, children: undefined, label: 'Option 8', type: undefined },
          { key: '9', icon: undefined, children: undefined, label: 'Option 9', type: undefined },
          { key: '10', icon: undefined, children: undefined, label: 'Option 10', type: undefined },
          { key: '11', icon: undefined, children: undefined, label: 'Option 11', type: undefined }
        ]
      }
    ]
  }
];
