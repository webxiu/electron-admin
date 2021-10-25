import { menuList, navList } from '@/Render/config/index';

import Header from './Navigation/Header';
import React from 'react';
import nav_merge from '@/Render/assets/img/navIcon/nav_merge.png';
import { useHistory } from 'react-router';

export interface BaseSiderProps {}

export const Wrap: React.FC = ({ children }) => {
  const history = useHistory();
  return (
    <section className="layout ui-vw-100 ui-vh-100 flex-col">
      <Header>
        <div className="flex ui-h-100">
          <div className="task-list-title drag">任务列表</div>
          <div className="flex align-center no-select">
            {navList.map((item) => (
              <div className="flex-col just-center align-center nav-item" key={item.key} onClick={() => console.log(`当前选项：`, item.title)}>
                <img width="16" src={item.icon} alt="" />
                <div className="fz12 nav-name" style={{ marginTop: 4 }}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Header>
      {/* 侧边栏 */}
      <div className="flex flex-1">
        <div className="sidebar flex-col just-between">
          <div className="flex-col align-center">
            {menuList.map((item) => (
              <div className="sidebar-item" key={item.key} onClick={() => history.push(item.path)}>
                <img width="100%" height="100%" src={item.icon} alt="" />
              </div>
            ))}
          </div>
          <div className="flex just-center ui-pb-20">
            <img width="22" height="22" src={nav_merge} alt="" />
          </div>
        </div>
        {/* 内容 */}
        <main className={`flex-1 flex ui-w-100 ui-h-100  ui-ov-h`}>
          <div className="main-layout flex ui-ovy-a ui-w-100 ui-h-100">{children}</div>
        </main>
      </div>
      <style jsx>{`
        .main-layout {
          overflow-y: auto;
        }
        .task-list-title {
          width: 232px;
          line-height: 56px;
          text-align: center;
          font-family: SourceHanSans-Bold;
          font-size: 12px;
          color: #a1a1a1;
          font-weight: 700;
          background: #1f1f22;
        }
        .nav-item {
          width: 72px;
          height: 100%;
        }
        .nav-item:hover {
          background-color: #000000;
        }
        .sidebar {
          width: 56px;
          background: #2b2c2d;
        }
        .sidebar-item {
          margin-top: 22px;
          width: 32px;
          height: 32px;
          border-radius: 5px;
          padding: 4px;
          cursor: pointer;
        }
        .sidebar-item:hover {
          background: #1f1f22;
        }
      `}</style>
    </section>
  );
};

export default Wrap;
