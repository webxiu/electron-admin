export interface TreeNode {
  label: string;
  value: number;
  children?: TreeNode[];
}

export const options: TreeNode[] = [
  {
    label: '111',
    value: 111,
    children: new Array(20).fill(null).map((_, index) => ({ label: `Number ${index}`, value: index }))
  },
  { label: '888', value: 888, children: [] },
  {
    label: '222',
    value: 222,
    children: [
      {
        label: '333',
        value: 333,
        children: [
          { label: '444', value: 444 },
          { label: '555', value: 555 },
          { label: '666', value: 666 }
        ]
      },
      {
        label: '777',
        value: 777,
        children: [
          { label: '888', value: 888 },
          { label: '999', value: 999 },
          { label: '1122', value: 1122 }
        ]
      }
    ]
  },
  {
    label: '123',
    value: 123,
    children: [{ label: '565', value: 565, children: [] }]
  },
  { label: '996', value: 996, children: [] }
];
