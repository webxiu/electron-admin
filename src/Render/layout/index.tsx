import Header from './Navigation/Header';
import Menu from './Navigation/Menu';
import React from 'react';
import { setWindowSize } from '@/Render/config/index';

export const Wrap: React.FC = ({ children }) => {
  const { width, height } = $$.AppInfo.window;
  setWindowSize(width, height);

  return (
    <section className="layout ui-vw-100 ui-vh-100 flex-col">
      <Header />
      <div className="flex flex-1">
        <Menu />
        <main className={`flex-1 flex ui-w-100 ui-h-100 ui-ov-h`}>
          <div className="main-layout flex ui-ovy-a ui-w-100 ui-h-100">{children}</div>
        </main>
      </div>
    </section>
  );
};

export default Wrap;
