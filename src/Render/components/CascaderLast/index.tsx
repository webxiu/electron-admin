import 'rc-cascader/assets/index.less';

import React, { useEffect, useState } from 'react';
import { TreeNode, options } from './config';

import RCCascader from 'rc-cascader';
import { Tag } from 'antd';

const CascaderLast = () => {
  const [selectList, setSelectList] = useState<number[]>([]);

  useEffect(() => {
    console.log(`selectList`, selectList);
  }, [selectList]);

  const removeItem = (value) => {
    console.log(`删除了:`, value);
  };

  return (
    <RCCascader
      // value={[[222, 333, 444], [888]]}
      defaultValue={[['222/333'], ['222/777']]}
      style={{ width: 260, maxHeight: 90, overflowY: 'auto' }}
      options={options}
      placeholder="请选择"
      onChange={(value, option) => {
        console.log(`value:`, value);
        console.log(`option:`, option);
      }}
      onDeselect={(value, option) => {
        console.log(`取消选择option:`, option);
      }}
      changeOnSelect
      onSelect={(value, option: TreeNode) => {
        setSelectList((x) => {
          const list = [...x, option.value];
          const arr = [...new Set(list)];
          console.log(`选择arr:`, arr);
          return arr;
        });
        console.log(`选择value:`, value);
        console.log(`选择option:`, option);
      }}
      // checkable={true}
      // // @ts-ignore
      // multiple
      expandTrigger={'click'}
      // tagRender={(props) => {
      //   return <span>{props.label}</span>;
      //   const lable = props.label as string;
      //   const res = lable.split('/');
      //   return (
      //     <>
      //       {res.map((r) => (
      //         <Tag closable onClose={removeItem.bind(null, r)}>
      //           {r}
      //         </Tag>
      //       ))}
      //     </>
      //   );
      // }}
      // dropdownRender={(menu) => {
      //   console.log(`menu`, menu);
      //   return <span>{menu}自定义</span>;
      // }}
    />
  );
};

export default CascaderLast;
