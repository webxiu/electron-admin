export type MenuItemTypes = {
  icon: string;
  img: string;
  key: string;
  title: string;
  path: string;
  discription: string;
};

export const menuList: MenuItemTypes[] = [
  {
    key: 'preprocess',
    title: '测试内容1',
    path: '/navigation/preprocess',
    icon: require('@/Render/assets/img/icons/menu_icon1.png').default,
    img: require('@/Render/assets/img/icons/start_icon1.png').default,
    discription: '支持对音频进行编辑、有效音提取、话者分离、声道分离、音频合并等操作'
  },
  {
    key: 'cluster',
    title: '测试内容2',
    path: '/navigation/cluster',
    icon: require('@/Render/assets/img/icons/menu_icon2.png').default,
    img: require('@/Render/assets/img/icons/start_icon2.png').default,
    discription: '把声音聚集再一起再操作、音频合并等操作'
  },
  {
    key: 'onestop',
    title: '测试内容3',
    path: '/navigation/onestop',
    icon: require('@/Render/assets/img/icons/menu_icon3.png').default,
    img: require('@/Render/assets/img/icons/start_icon3.png').default,
    discription:
      '我是很长的文本, 我是很长的文本, 我是很长的文本, 我是很长的文本, 我是很长的文本, 我是很长的文本, 我是很长的文本, 我是很长的文本, 支持对音频进行编辑、有效音提取、话者分离、声道分离、音频合并等操作'
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
