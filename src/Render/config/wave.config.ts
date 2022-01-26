export interface NavItemTypes {
  key: string;
  icon: string;
  title: string;
}

export const waveOptions: NavItemTypes[] = [
  {
    key: 'wave_new',
    title: '导入',
    icon: require('@/Render/assets/img/navIcon/nav_task.png').default
  },
  {
    key: 'wave_export',
    title: '导出',
    icon: require('@/Render/assets/img/navIcon/wave_export.png').default
  },

  /** ==================================== 图谱操作 ==================================== */
  {
    key: 'wave_save',
    title: '保存',
    icon: require('@/Render/assets/img/navIcon/wave_save.png').default
  },
  {
    key: 'wave_all',
    title: '全选',
    icon: require('@/Render/assets/img/navIcon/wave_export.png').default
  },
  {
    key: 'wave_cut',
    title: '剪切',
    icon: require('@/Render/assets/img/navIcon/wave_cut.png').default
  },
  {
    key: 'wave_copy',
    title: '复制',
    icon: require('@/Render/assets/img/navIcon/wave_copy.png').default
  },
  {
    key: 'wave_paste',
    title: '粘贴',
    icon: require('@/Render/assets/img/navIcon/wave_paste.png').default
  },
  {
    key: 'wave_delete',
    title: '删除片段',
    icon: require('@/Render/assets/img/navIcon/wave_delete.png').default
  },
  {
    key: 'wave_mark',
    title: '标记',
    icon: require('@/Render/assets/img/navIcon/wave_mark.png').default
  },
  {
    key: 'wave_mark_del',
    title: '取消标记',
    icon: require('@/Render/assets/img/navIcon/wave_mark_off.png').default
  },
  {
    key: 'wave_undo',
    title: '撤销',
    icon: require('@/Render/assets/img/navIcon/wave_revoke.png').default
  }
  // {
  //   key: 'wave_recovery',
  //   title: '恢复',
  //   icon: require('@/Render/assets/img/navIcon/wave_recovery.png').default
  // }
];
