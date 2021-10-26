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
    title: '音频预处理',
    path: '/home/dashboard',
    icon: require('@/Render/assets/img/menu/menu_preprocess.png').default,
    icon_on: require('@/Render/assets/img/menu/menu_preprocess_on.png').default
  },
  {
    key: 'manage',
    title: '声纹聚类',
    path: '/home/manage',
    icon: require('@/Render/assets/img/menu/menu_cluster.png').default,
    icon_on: require('@/Render/assets/img/menu/menu_cluster_on.png').default
  },
  {
    key: 'onestop',
    title: '一站式处理',
    path: '/home/onestop',
    icon: require('@/Render/assets/img/menu/menu_onestop.png').default,
    icon_on: require('@/Render/assets/img/menu/menu_onestop_on.png').default
  }
];

export type NavItemTypes = {
  key: string;
  icon: string;
  title: string;
};

export const navList: NavItemTypes[] = [
  {
    key: 'nav_task',
    title: '新建任务',
    icon: require('@/Render/assets/img/navIcon/nav_task.png').default
  },
  {
    key: 'nav_export',
    title: '导出',
    icon: require('@/Render/assets/img/navIcon/nav_export.png').default
  },
  {
    key: 'nav_retry',
    title: '重试',
    icon: require('@/Render/assets/img/navIcon/nav_retry.png').default
  },
  {
    key: 'nav_valid_voice',
    title: '有效音提取',
    icon: require('@/Render/assets/img/navIcon/nav_valid_voice.png').default
  },
  {
    key: 'nav_word_separate',
    title: '话者分离',
    icon: require('@/Render/assets/img/navIcon/nav_word_separate.png').default
  },
  {
    key: 'nav_voice_separate',
    title: '声道分离',
    icon: require('@/Render/assets/img/navIcon/nav_voice_separate.png').default
  },
  {
    key: 'nav_merge',
    title: '音频合并',
    icon: require('@/Render/assets/img/navIcon/nav_merge.png').default
  },
  {
    key: 'nav_delete',
    title: '删除',
    icon: require('@/Render/assets/img/navIcon/nav_delete.png').default
  }
];
