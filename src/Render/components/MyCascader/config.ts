export interface TreeNode {
  title: string;
  id: number;
  children?: TreeNode[];
}

export const menu: TreeNode[] = [
  {
    id: 456,
    title: '一级菜单1',
    children: [
      {
        id: 43,
        title: '二级菜单1',
        children: [
          {
            id: 633,
            title: '二级菜单3',
            children: [
              { id: 543, title: '二级菜单1' },
              { id: 545, title: '二级菜单2' },
              { id: 445355, title: '二级菜单3' }
            ]
          }
        ]
      },
      { id: 23434, title: '二级菜单2' },
      {
        id: 890,
        title: '二级菜单3',
        children: [
          { id: 23, title: '二级菜单1' },
          { id: 5, title: '二级菜单2' },
          { id: 45, title: '二级菜单3' }
        ]
      }
    ]
  },
  { id: 233424, title: '一级菜单2' },
  {
    id: 34234,
    title: '一级菜单3',
    children: [
      { id: 3215, title: '一级菜单3-1' },
      { id: 6465, title: '一级菜单3-2' },
      { id: 456548, title: '一级菜单3-3' }
    ]
  }
];
