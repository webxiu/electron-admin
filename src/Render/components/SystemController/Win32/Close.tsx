import React, { useEffect, useRef, useState } from 'react';
import { ipcRenderer, remote } from 'electron';

import { AppEventNames } from '@/Types/EventTypes';
import { Modal } from 'antd';
import Package from '~/package.json';
import { logout } from '@/Render/service';

const Wrap: React.FC = () => {
  const __size__ = 16;
  const __color__ = '#92929D';
  const showModal = useRef<boolean>(true);
  const [color, setColor] = useState<string>(__color__);

  useEffect(() => {
    ipcRenderer.on(AppEventNames.WINDOW_CLOSE, onClose);
    return () => {
      ipcRenderer.removeListener(AppEventNames.WINDOW_CLOSE, onClose);
    };
  }, []);

  const onClose = (ev, arg) => {
    if (showModal.current) {
      showModal.current = false;
      Modal.confirm({
        title: '提示',
        centered: true,
        content: <p className="ui-ta-c">您确认退出{Package.build.productName}系统？</p>,
        onOk: () => {
          logout({});
          remote.getGlobal('globalData').showCloseModal = false;
          remote.getCurrentWindow().close();
        },
        onCancel: () => {
          showModal.current = true;
        }
      });
    }
  };

  /** 仅触发关闭(兼容任务栏右键关闭), 再经过主进程 WINDOW_CLOSE事件处理关闭 */
  const onFunc = () => {
    remote.getCurrentWindow().close();
  };
  const onMouseEnter = () => {
    setColor('#CE5B53');
  };
  const onMouseLeave = () => {
    setColor(__color__);
  };
  return (
    <>
      <span onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onFunc}>
        <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5512" width={__size__} height={__size__}>
          <path
            d="M822.003 776.822l0.023-0.022-575.522-575.483c-5.788-5.792-13.786-9.374-22.621-9.374-17.662 0-31.98 14.318-31.98 31.98 0 8.834 3.582 16.832 9.373 22.62L776.112 821.34c5.84 6.278 14.167 10.21 23.417 10.21 17.662 0 31.98-14.318 31.98-31.98 0-8.901-3.638-16.949-9.506-22.747z"
            p-id="5513"
            fill={color}
          ></path>
          <path
            d="M776.784 201.448l-0.023-0.022-575.483 575.521c-5.792 5.788-9.374 13.786-9.374 22.621 0 17.663 14.318 31.98 31.98 31.98 8.834 0 16.832-3.582 22.62-9.373L821.301 247.34c6.278-5.839 10.21-14.166 10.21-23.416 0-17.662-14.318-31.98-31.98-31.98-8.902 0-16.95 3.637-22.747 9.505z"
            p-id="5514"
            fill={color}
          ></path>
        </svg>
      </span>
      <style jsx>{`
        span {
          padding: 0 16px;
          display: flex;
          justify-content: center;
          width: auto;
          align-items: center;
          background-color: transparent;
        }
        span:hover {
          background-color: #afa4a5;
        }
      `}</style>
    </>
  );
};

export default Wrap;
