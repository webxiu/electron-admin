import { FormOutlined } from '@ant-design/icons';
import React from 'react';
import { SignProps } from '../index';
import { Table } from '@/Render/components/Antd';
import { useTranslation } from 'react-i18next';
import utils from '@/Render/utils/index';

interface Props {
  dataSource: SignProps[];
  isSearchVoiceSign?: boolean;
  onEditSign?: (sign: SignProps) => void;
}

const SignTable: React.FC<Props> = (props) => {
  const { dataSource, onEditSign, isSearchVoiceSign = false } = props;
  const { t } = useTranslation(['common']);
  /** 音频预处理标注配置 */
  let columns = [
    { title: t('common:start'), dataIndex: 'startTime', key: 'startTime', ellipsis: true, render: (value: number) => utils.toHHmmss(value) },
    { title: t('common:end'), dataIndex: 'endTime', key: 'endTime', ellipsis: true, render: (value: number) => utils.toHHmmss(value) },
    {
      title: t('common:content'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (value: string, record: SignProps) => {
        return (
          <div className="flex just-between align-center">
            <span className="flex-1 ellipsis ui-ta-l" title={value}>
              {value}
            </span>
            <FormOutlined title={t('common:edit')} onClick={() => onEditSign && onEditSign(record)} />
          </div>
        );
      }
    }
  ];
  /** 智能标注不显示内容 */
  if (!dataSource[0]?.isManual) {
    columns = columns.filter((item) => item.key !== 'name');
  }
  return <Table scroll={{ y: 200 }} columns={columns} dataSource={dataSource} rowKey="id" showPagination={false} />;
};

export default SignTable;
