import { Button, MultiCascader, Tag } from 'rsuite';
import React, { useEffect, useMemo, useState } from 'react';

import MyCascader from '@/Render/components/MyCascader';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

interface TreeNodeItem {
  label: string;
  value: number;
  pid: number;
  children?: TreeNodeItem[];
}

const Wrap: React.FC = () => {
  const { push } = useHistory();
  const { t } = useTranslation('login');

  const data: TreeNodeItem[] = [
    {
      label: '111',
      value: 111,
      pid: 0,
      children: [
        {
          label: '69',
          value: 69,
          pid: 111,
          children: [
            { label: '691', pid: 69, value: 691 },
            { label: '692', pid: 69, value: 692 },
            { label: '693', pid: 69, value: 693 }
          ]
        }
      ]
    },
    {
      label: '222',
      value: 222,
      pid: 0,
      children: [
        {
          label: '333',
          value: 333,
          pid: 222,
          children: [
            { label: '444', pid: 333, value: 444 },
            { label: '555', pid: 333, value: 555 },
            { label: '666', pid: 333, value: 666 }
          ]
        },
        {
          label: '777',
          value: 777,
          pid: 222,
          children: [
            { label: '888', pid: 777, value: 888 },
            { label: '999', pid: 777, value: 999 },
            { label: '1122', pid: 777, value: 1122 }
          ]
        }
      ]
    },
    {
      label: '123',
      value: 123,
      pid: 0,
      children: [{ label: '565', pid: 123, value: 565, children: [] }]
    },
    { label: '889', pid: 0, value: 889, children: [] }
  ];

  const [selectList, setSelectList] = useState<number[]>([]);

  useEffect(() => {
    console.log(`selectList`, selectList);
  }, [selectList]);

  /**查找一个节点的所有父节点*/
  const getAllParentNodes = useMemo(
    () => (arr1: TreeNodeItem[], id: number) => {
      const temp: number[] = [];
      const forFn = function (arr: TreeNodeItem[], cid: number) {
        for (let i = 0; i < arr.length; i++) {
          const item: TreeNodeItem = arr[i];
          if (item.value === cid) {
            console.log(`selectList`, selectList);
            if (cid !== id && selectList.includes(item.value)) {
              temp.push(item.value);
            }
            forFn(arr1, item.pid);
            break;
          } else {
            if (item.children) {
              forFn(item.children, cid);
            }
          }
        }
      };
      forFn(arr1, id);
      return temp;
    },
    [selectList]
  );

  /** 查找一个节点的所有子节点 */
  const getAllChildrenNodes = (arr1: TreeNodeItem[]) => {
    const temp: number[] = [];
    const forFn = function (arr: TreeNodeItem[]) {
      for (let i = 0; i < arr.length; i++) {
        const item: TreeNodeItem = arr[i];
        if (selectList.includes(item.value)) {
          temp.push(item.value);
        }
        if (item.children && item.children?.length > 0) {
          forFn(item.children);
        }
      }
    };
    forFn(arr1);
    return temp;
  };

  /** 是否存在子项children */
  const hasChildrenList = (options: TreeNodeItem[], value: number) => {
    for (let i = 0; i < options.length; i++) {
      const item = options[i];
      if (item.value === value) {
        // console.log(`找到要删除的子项`, value, item.children);
        if (item.children?.length) {
          findChildItem(item.children);
          setSelectList((x) => [...x, value]);
          break;
        }
      } else if (item.children && item.children?.length > 0) {
        hasChildrenList(item.children, value);
      }
    }
  };

  /** 循环删除每一个 */
  const findChildItem = (options: TreeNodeItem[]) => {
    options.forEach((item) => {
      // console.log(`删除`, item.value);
      if (item.value) {
        removeSelectItem(item.value);
      }
      if (item.children && item.children?.length > 0) {
        findChildItem(item.children);
      }
    });
  };

  /** 删除方法 */
  const removeSelectItem = (value: number) => {
    setSelectList((x) => x.filter((item) => item !== value));
  };

  /** 有就添加/没有就删除 */
  const onChangeSelect = (value) => {
    console.log(`删除了:`, value);
    setSelectList((x) => {
      const _data = [...x];
      if (_data.includes(value)) {
        const res = _data.filter((item) => item !== value);
        console.log(`删除`);
        return res;
      } else {
        console.log(`添加`);
        return [...new Set([..._data, value])];
      }
    });
  };

  return (
    <div>
      <div>=====应用名称:{t('appName')} ========</div>
      <div className="box">=====css-in-js样式====</div>
      <div className="test">=====less样式====</div>
      <div className="var-css">=====var变量样式====</div>
      <div className="less-var">=====less变量样式====</div>
      <div className="flex">=====define通用样式====</div>
      <hr />
      <MultiCascader
        placeholder="请选择"
        appearance="subtle"
        value={selectList}
        style={{ width: 200 }}
        renderValue={(value, selectedItems, selectedElement) => {
          // return selectedElement
          return (
            <span>
              {selectedItems.map((r) => (
                <Tag key={r.value} closable onClose={onChangeSelect.bind(null, r.value)}>
                  {r.label}
                </Tag>
              ))}
            </span>
          );
        }}
        // onChange={(value: number[], ev) => setSelectList(value)}
        onChange={(value: number[], ev) => {
          console.log(`onChange`, value);
          // setSelectList(value);
        }}
        onCheck={(value: number[], node, checked, ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          console.log(`checked==>:`, checked, node);
          let children: TreeNodeItem[] = [];
          if (node.children) {
            children = node.children as TreeNodeItem[];
          }
          const parentList = getAllParentNodes(data, node.value as number);
          const childList = getAllChildrenNodes(children);
          console.log(`====所有的父节点:`, parentList);
          console.log(`====所有的子节点:`, childList);

          if (checked) {
            const allResult = [...parentList, ...childList];
            console.log(`allResult`, allResult);

            if (allResult.length > 0) {
              const checkList: number[] = value.filter((item) => !allResult.includes(item));
              setSelectList(checkList);
            } else {
              setSelectList(value);
            }

            console.log(`勾选`, value);
            // hasChildrenList(data, node.value as number);
          } else {
            console.log(`取消勾选`, value);
          }
        }}
        onSelect={(option, ev) => {
          console.log(`onSelect`, option);
          // setSelectList(value);
        }}
        unselectable="off"
        data={data}
        // disabledItemValues={[111, 222]}
        countable={false}
        searchable={false}
        cascade={false}
        cleanable={false}
        open={true}
        // uncheckableItemValues={showSelectBox}
      />
      <hr />
      <MyCascader />
      <hr />

      <Button>风口浪尖</Button>

      <style jsx>{`
        .box {
          background-color: #0f0;
        }
        .var-css {
          background-color: var(--bdc);
        }
      `}</style>
    </div>
  );
};

export default Wrap;
