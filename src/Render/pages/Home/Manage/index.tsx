import { Button, MultiCascader } from 'rsuite';

import React from 'react';
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
    { label: '996', value: 996, children: [] }
  ];

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
        onChange={(value, ev) => {
          console.log(`value,ev`, value);
        }}
        data={data}
        countable={true}
        searchable={false}
        cascade={false}
        renderMenuItem={(itemLabel, item) => {
          console.log(`itemLabel, item`, itemLabel, item);
          return <span className={item.children?.length === 0 ? 'top' : ''}>{itemLabel}</span>;
        }}
      />
      <hr />
      <Button>风口浪尖</Button>

      {/* <style jsx global>{`
        .rs-picker-cascader-menu-column:not(:last-child) ul .rs-checkbox-wrapper {
          visibility: hidden;
        }
        .rs-picker-cascader-menu-column .rs-check-item .top ~ .rs-checkbox-wrapper {
          visibility: visible !important;
          background: #f60;
        }
      `}</style> */}
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
