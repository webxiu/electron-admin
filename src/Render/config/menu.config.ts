export type MenuItemTypes = {
  key: string;
  title: string;
  path: string;
  icon: string;
  icon_on: string;
};

export const menuList: MenuItemTypes[] = [
  {
    key: 'dashboard',
    title: '首页',
    path: '/home/dashboard',
    icon: require('@/Render/assets/img/menu/menu_preprocess.png').default,
    icon_on: require('@/Render/assets/img/menu/menu_preprocess_on.png').default
  },
  {
    key: 'manage',
    title: '管理',
    path: '/home/manage',
    icon: require('@/Render/assets/img/menu/menu_cluster.png').default,
    icon_on: require('@/Render/assets/img/menu/menu_cluster_on.png').default
  },
  {
    key: 'onestop',
    title: '一站式',
    path: '/home/onestop',
    icon: require('@/Render/assets/img/menu/menu_onestop.png').default,
    icon_on: require('@/Render/assets/img/menu/menu_onestop_on.png').default
  },
  {
    key: 'media',
    title: '媒体',
    path: '/home/media',
    icon: require('@/Render/assets/img/menu/menu_setting.png').default,
    icon_on: require('@/Render/assets/img/menu/menu_setting_on.png').default
  },
  {
    key: 'stretch',
    title: '布局',
    path: '/home/stretch',
    icon: require('@/Render/assets/img/menu/menu_cluster.png').default,
    icon_on: require('@/Render/assets/img/menu/menu_cluster_on.png').default
  }
];
