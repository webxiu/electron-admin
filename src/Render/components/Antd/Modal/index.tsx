import { Modal as AntdModal, Button } from 'antd';
import React, { useEffect } from 'react';

import Drag from './Drag';
import { ModalProps } from 'antd/lib/modal';

interface BaseModalProps extends ModalProps {
  hideOkButton?: boolean;
  hideCancelButton?: boolean;
  /** 弹窗标题下面的线 */
  headerBorder?: boolean;
  isFullModal?: boolean;
}

let timer: NodeJS.Timeout | number = 0;
export const Modal: React.FC<BaseModalProps> = ({
  children,
  width = 520,
  style,
  bodyStyle,
  isFullModal = false,
  headerBorder = false,
  hideCancelButton = false,
  hideOkButton = false,
  visible,
  ...restProps
}) => {
  const footer: React.ReactChild[] = [];

  useEffect(() => {
    timer = setTimeout(() => {
      new Drag('.ant-modal-header', '.ant-modal').init();
    }, 0);
    return () => {
      clearTimeout(timer as number);
    };
  }, [visible]);

  if (!hideOkButton) {
    footer.push(
      <Button key="submit" {...restProps.okButtonProps} type="primary" onClick={restProps.onOk}>
        确定
      </Button>
    );
  }
  if (!hideCancelButton) {
    footer.push(
      <Button key="back" {...restProps.cancelButtonProps} onClick={restProps.onCancel}>
        取消
      </Button>
    );
  }
  return (
    <>
      <AntdModal
        destroyOnClose={true}
        visible={visible}
        className={`g-modal ${headerBorder ? 'border' : ''}`}
        maskClosable={false}
        footer={footer}
        style={{ top: isFullModal ? '5%' : '10%', ...style }}
        width={isFullModal ? '91%' : width}
        bodyStyle={{ height: isFullModal ? '80vh' : '100%', overflowY: 'auto', ...bodyStyle }}
        {...restProps}
      >
        {children}
      </AntdModal>
      <style jsx global>{`
        .g-modal .ant-modal-header {
          background: #2b2c2d;
          border-bottom: none;
        }
        .g-modal.border .ant-modal-header {
          border-bottom: 1px solid #44444f;
        }
        .g-modal .ant-modal-title {
          color: #fafafb;
          font-size: 20px;
          text-align: center;
        }
        .g-modal .ant-modal-title .sub-title {
          font-size: 14px;
          margin-left: 30px;
        }
        .g-modal .ant-modal-body {
          background-color: #1b1b1b;
          color: #fff;
        }
        .g-modal .ant-modal-content {
          background-color: #1b1b1b;
          color: #fff;
        }
        .g-modal .ant-modal-footer {
          background-color: #1b1b1b;
          border-top: none;
          text-align: center;
        }
        .g-modal .ant-modal-close-icon {
          font-size: 12px;
          color: var(--color_red);
          padding: 5px 10px;
        }
      `}</style>
    </>
  );
};
