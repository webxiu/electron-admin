import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

import { menuList } from '@/Render/config/index';
import { useObserver } from 'mobx-react';

interface Props {}

export const Header: React.FC<Props> = (props) => {
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {}, []);

  return useObserver(() => (
    <>
      <div className="sidebar flex-col align-center">
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
          background: #929297;
        }
      `}</style>
    </>
  ));
};

export default Header;
