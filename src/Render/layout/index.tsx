import FooterS from './Navigation/Footer';
import HeaderS from './Navigation/Header';
import { Layout } from 'antd';
import Menu from './Navigation/Menu';
import React from 'react';
import { setWindowSize } from '@/Render/config/index';

const { Header, Footer, Sider, Content } = Layout;

export const Wrap: React.FC = ({ children }) => {
  const { width, height } = $$.AppInfo.window;
  setWindowSize(width, height);

  return (
    <section className="layout ui-vw-100 ui-vh-100 flex-col">
      <Layout>
        <Header>
          <HeaderS showMaximize />
        </Header>
        <Layout>
          <Sider theme="light">
            <Menu />
          </Sider>
          <Layout>
            <Content>
              <main className={`flex-1 flex ui-w-100 ui-h-100 ui-ov-h`}>
                <div className="main-layout flex ui-ovy-a ui-w-100 ui-h-100">{children}</div>
              </main>
            </Content>
            <Footer>
              <FooterS />
            </Footer>
          </Layout>
        </Layout>
      </Layout>
      <style jsx global>{`
        .ant-layout-header {
          height: inherit;
          padding: 0;
          background: transparent;
        }
      `}</style>
    </section>
  );
};

export default Wrap;
