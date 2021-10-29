import React, { useEffect } from 'react';
import { menuList, navList } from '@/Render/config/index';
import { useHistory, useLocation } from 'react-router';

import { Menu } from 'antd';
import nav_merge from '@/Render/assets/img/navIcon/nav_merge.png';
import { useInject } from '@/Render/components/Hooks';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';

interface Props {}

export const Header: React.FC<Props> = (props) => {
  const history = useHistory();
  const location = useLocation();

  const { t } = useTranslation('login');

  useEffect(() => {}, []);

  const goTo = (href: string) => {
    history.push(href);
  };

  return useObserver(() => (
    <>
      <div className="sidebar flex-col just-between">
        <div className="flex-col align-center">
          {menuList.map((item) => (
            <div
              className={`sidebar-item${item.path === location.pathname ? ' active' : ''}`}
              title={item.title}
              key={item.key}
              onClick={() => history.push(item.path)}
            >
              <img width="100%" height="100%" src={item.path === location.pathname ? item.icon_on : item.icon} alt="" />
            </div>
          ))}
        </div>
        <div className="flex just-center ui-pb-20">
          <img width="22" height="22" src={nav_merge} alt="" />
        </div>
      </div>
      <style jsx>{`
        .sidebar {
          width: 56px;
          background: #fff;
          margin: 5px 10px;
        }
        .sidebar-item {
          margin-top: 22px;
          width: 32px;
          height: 32px;
          border-radius: 5px;
          padding: 4px;
          cursor: pointer;
        }
        .sidebar-item.active,
        .sidebar-item:hover {
          background: #1f1f22;
        }
      `}</style>
    </>
  ));
};

export default Header;
