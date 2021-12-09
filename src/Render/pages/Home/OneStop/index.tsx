import { Button, Cascader, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { useHistory } from 'react-router';

const { SHOW_PARENT } = TreeSelect;
interface TreeNode {
  label: string;
  value: number;
  children?: TreeNode[];
}

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0'
      }
    ]
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0'
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1'
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2'
      }
    ]
  }
];

const Wrap: React.FC = () => {
  const options: TreeNode[] = [
    {
      label: '111',
      value: 111,
      children: new Array(20).fill(null).map((_, index) => ({ label: `Number ${index}`, value: index }))
    },
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

  const [selectList, setSelectList] = useState<number[]>([]);

  const [treeList, setTreeList] = useState<string[]>(['0-0-0']);

  console.log(`options`, options);
  useEffect(() => {
    console.log(`selectList`, selectList);
  }, [selectList]);

  const { push } = useHistory();

  const tProps = {
    treeData,
    value: treeList,
    onChange: (value) => {
      console.log('onChange ', value);
      setTreeList(value);
    },
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: 'Please select',
    style: {
      width: '100%'
    }
  };

  return (
    <div>
      <div className="box">
        ===============
        <Button type="primary" onClick={() => push('/login')}>
          退出
        </Button>
        <hr />
        <Cascader
          // value={[[123], [222, 777]]}
          options={options}
          placeholder="请选择"
          onChange={(value, option) => {
            console.log(`value:`, value);
            console.log(`option:`, option);
          }}
          onPopupScroll={(...arg) => {
            console.log(`changeOnSelect`, arg);
          }}
          onDeselect={(value, option) => {
            console.log(`取消选择option:`, option);
          }}
          onSelect={(value, option: TreeNode) => {
            setSelectList((x) => {
              const list = [...x, option.value];
              const arr = [...new Set(list)];
              return arr;
            });
            console.log(`选择option:`, option);
          }}
          onTreeExpand={(...arg) => {
            console.log(`onTreeExpand`, arg);
          }}
          multiple
          defaultActiveFirstOption={true}
          changeOnSelect
          expandTrigger={'click'}
          // tagRender={(props) => <span>{props.value}===</span>}
          dropdownRender={(menu) => {
            console.log(`menu`, menu);
            return <span>{menu}自定义</span>;
          }}
          labelRender={(entity, value) => {
            console.log(`===============entity,value`, entity, value);
            return <span>{value}9898=</span>;
          }}
        />
        <hr />
        <TreeSelect {...tProps} />
      </div>
      {/* <style jsx global>{`
        .ant-cascader-menus .ant-cascader-menu:not(:last-child) .ant-cascader-checkbox {
          visibility: hidden;
        }
        .ant-cascader-menus .ant-cascader-menu:firsh-child .ant-cascader-checkbox {
          visibility: block;
        }
      `}</style> */}
    </div>
  );
};

export default Wrap;
