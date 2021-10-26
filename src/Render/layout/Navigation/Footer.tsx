import React, { useEffect } from 'react';
import { menuList, navList } from '@/Render/config/index';
import { useHistory, useLocation } from 'react-router';

import { useInject } from '@/Render/components/Hooks';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';

const { appName, versions } = $$.AppInfo;
const version = versions.appVersion;

interface Props {}
export const Header: React.FC<Props> = (props) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation('login');

  useEffect(() => {}, []);

  return useObserver(() => (
    <div className="flex just-center footer">
      <span>©2021 {appName} Tec.co&nbsp;</span>
      <span>版本 v{version}</span>
      <style jsx>{`
        .footer {
          padding: 5px;
          background: var(--menuColor);
        }
      `}</style>
    </div>
  ));
};

export default Header;
