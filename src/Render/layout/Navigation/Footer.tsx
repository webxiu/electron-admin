import React from 'react';

const { appName, versions } = $$.AppInfo;
const version = versions.appVersion;

export const Header: React.FC = () => {
  return (
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
  );
};

export default Header;
