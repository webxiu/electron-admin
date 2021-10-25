import { ColumnProps, TableProps } from 'antd/lib/table';

import { Table as AntdTable } from 'antd';
import DateTime from '../DateTime';
import EllipsisText from '../EllipsisText';
import NoData from '../NoData';
import React from 'react';

interface BaseListSummary {
  pageCurrent: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type BaseColumnProps<T> = ColumnProps<T> & {
  timestamp?: boolean;
  no?: boolean;
  disable?: boolean;
};

interface Props<T> extends TableProps<T> {
  topArea?: React.ReactNode;
  bottomArea?: React.ReactNode;
  listSummary?: BaseListSummary;
  rowSelection?: TableProps<T>['rowSelection'] & {
    selectedRows?: T[];
    onClear?: () => void;
    selectLimit?: number | [number, number];
  };
  columns: BaseColumnProps<T>[];
  onPaginationChange?: (page: number, pageSize?: number) => void;
  showPagination?: boolean;
}

export function Table<T extends Record<string, any>>(props: Props<T>) {
  const defaultListSummary: BaseListSummary = {
    pageCurrent: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  };
  const {
    listSummary = defaultListSummary,
    dataSource = [],
    rowKey = 'id',
    showPagination = true,
    bottomArea,
    topArea,
    rowSelection,
    columns,
    ...otherPops
  } = props;

  const { pageCurrent, pageSize, totalItems } = listSummary;

  const formatColumns = (listSummary: BaseListSummary, columns: BaseColumnProps<T>[]): BaseColumnProps<T>[] => {
    const { pageCurrent, pageSize } = listSummary;
    const noID = (pageCurrent - 1) * pageSize;
    const transFormText = (text?: string | string[]) => {
      if (!text) return '';
      if ($$.isArray(text)) {
        return (text as string[]).join(',');
      }
      if ($$.isString(text)) {
        return text;
      }
      return String(text);
    };
    return columns
      .filter((col) => !col.disable)
      .map((col) => {
        col = { ...col };
        col.align = 'center';
        /** 时间戳转换 */
        if (col.timestamp && !col.render) {
          col.render = (text: string) => (
            <EllipsisText>
              <DateTime date={text} dateFormat={'YYYY-MM-DD'} />
            </EllipsisText>
          );
        }
        /** 超出一行省略 */
        if (col.ellipsis && !col.render) {
          col.render = (text: string) => <EllipsisText>{transFormText(text)}</EllipsisText>;
        }
        /** 自动生成序号 */
        if (col.no) {
          col.render = (text, record, index: number) => noID + index + 1;
        }
        return col;
      });
  };

  return (
    <>
      <div className={'table-header'}>{topArea}</div>
      <div className="table-wrap">
        <AntdTable<T>
          pagination={
            showPagination && {
              className: 'm-pagination',
              showTotal: (total: number) => `共${total}条`,
              showQuickJumper: true,
              pageSizeOptions: ['10', '50', '100'],
              showSizeChanger: false,
              current: pageCurrent,
              pageSize,
              total: totalItems,
              onChange: (page, pageSize) => {
                props.onPaginationChange && props.onPaginationChange(page, pageSize);
              }
            }
          }
          rowSelection={rowSelection}
          dataSource={dataSource}
          rowKey={rowKey}
          columns={formatColumns(listSummary, columns)}
          locale={{ emptyText: <NoData /> }}
          {...otherPops}
        />
        {bottomArea && dataSource?.length > 0 && <div className={'table-footer'}>{bottomArea}</div>}
      </div>
      <style jsx global>{`
        .table-wrap {
          position: relative;
        }
        .table-wrap .ant-spin-container::after {
          background: rgba(0, 0, 0, 0.01) !important;
        }
        .table-wrap .ant-table {
          background: transparent;
          color: #92929d;
        }
        .table-footer {
          position: absolute;
          bottom: 40px;
        }

        .m-pagination {
          margin-top: 20px !important;
        }
      `}</style>
    </>
  );
}

export default Table;
