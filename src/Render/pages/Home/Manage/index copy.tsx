import { Button, MultiCascader, Tag } from 'rsuite';
import React, { useState } from 'react';

import MyCascader from '@/Render/components/MyCascader';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

interface TreeNode {
  label: string;
  value: number;
  children?: TreeNode[];
}

const Wrap: React.FC = () => {
  const { push } = useHistory();
  const { t } = useTranslation('login');

  const data: TreeNode[] = [
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
    { label: '889', value: 889, children: [] }
  ];

  const [selectList, setSelectList] = useState<number[]>([222, 777, 999]);
  const [showSelectBox, setShowSelectBox] = useState<number[]>([777]);
  React.useEffect(() => {
    setTimeout(() => {
      setSelectList([222, 777, 333]);
    }, 2000);
  }, []);

  /** 是否存在子项children */
  const hasChildrenList = (options: TreeNode[], value: number) => {
    for (let i = 0; i < options.length; i++) {
      const item = options[i];
      if (item.value === value) {
        console.log(`找到要删除的子项`, value, item.children);
        if (item.children?.length) {
          findChildItem(value, item.children);
          break;
        }
      } else if (item.children && item.children?.length > 0) {
        hasChildrenList(item.children, value);
      }
    }
  };

  /** 循环删除每一个 */
  const findChildItem = (clickVal: number, options: TreeNode[]) => {
    options.forEach((item) => {
      console.log(`删除`, item.value);
      if (item.value) {
        removeSelectItem(item.value);
      }
      if (item.children && item.children?.length > 0) {
        findChildItem(clickVal, item.children);
      }
    });
    setSelectList((x) => {
      const _data = [...x];
      if (_data.includes(clickVal)) {
        const res = _data.filter((item) => item !== clickVal);
        console.log(`删除`);
        return res;
      } else {
        console.log(`添加`);
        return [...new Set([..._data, clickVal])];
      }
    });
  };

  /** 删除方法 */
  const removeSelectItem = (value: number) => {
    setSelectList((x) => {
      const _data = [...x];
      const res = _data.filter((item) => item !== value);
      console.log(`移除选项`, value, '结果', res);
      return res;
    });
  };

  const removeItem = (value) => {
    console.log(`删除了:`, value);
    setSelectList((x) => {
      const _data = [...x];
      const res = _data.filter((item) => item !== value);
      return res;
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
                <Tag key={r.value} closable onClose={removeItem.bind(null, r.value)}>
                  {r.label}
                </Tag>
              ))}
            </span>
          );
        }}
        // onChange={(value: number[], ev) => setSelectList(value)}
        onChange={(value: number[], ev) => {
          console.log(`onChange`, value);
          setSelectList(value);
        }}
        onCheck={(value: number[], ev) => {
          const val = value[value.length - 1];
          if (value.length > selectList.length) {
            // 勾选
            // hasChildrenList(data, val);
            console.log(`勾选`, val);
          } else {
            // 取消勾选
            console.log(`取消勾选`, val);
          }
          // setSelectList(value);
        }}
        onSelect={(option, ev) => {
          console.log(`点击标题onSelect`, option);
        }}
        unselectable="off"
        data={data}
        // disabledItemValues={[111, 222]}
        countable={false}
        searchable={false}
        cascade={false}
        cleanable={false}
        uncheckableItemValues={showSelectBox}
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
