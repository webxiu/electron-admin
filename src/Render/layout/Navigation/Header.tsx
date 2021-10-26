import { Dropdown, Menu, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { getLanguage, setLanguage } from '@/Render/utils/auth';

import { DownOutlined } from '@ant-design/icons';
import GroupIcon from '@/Render/assets/img/icons/group_icon.png';
import ListIcon from '@/Render/assets/img/icons/list_icon.png';
import PubSub from 'pubsub-js';
import SystemController from '@/Render/components/SystemController';
import i18n from '@/Render/routes/i18n';
import { useHistory } from 'react-router';
import { useInject } from '@/Render/components/Hooks';
import { useObserver } from 'mobx-react';
import { useTranslation } from 'react-i18next';

const { SubMenu } = Menu;

interface Props {
  /** 是否显示最大化 */
  showMaximize?: boolean;
}

export const Header: React.FC<Props> = (props) => {
  const { showMaximize } = props;
  const Store = useInject('Global');
  const history = useHistory();
  const { t } = useTranslation('login');
  const [changeLang, setChangeLang] = useState<string>('');

  useEffect(() => {
    const lang = getLanguage();
    if (lang) {
      setLanguage(lang);
      setChangeLang(lang);
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage(changeLang);
    }
  }, [changeLang]);

  const goTo = (href: string) => {
    history.push(href);
  };

  const changeLanguage = () => {
    setChangeLang((lang) => {
      const l = lang === 'zh_CN' ? 'en' : 'zh_CN';
      setLanguage(l);
      return l;
    });
  };

  return useObserver(() => (
    <header className="drag">
      <div className="flex just-between ui-h-100">
        <div className="flex just-center align-center app-logo">
          <img src={t('logo')} width="36" alt="" className="no-drag no-select" onClick={() => history.push('/login')} />
        </div>
        <div className="control-group">
          <div className="flex ui-h-100 just-center align-center header-right-options">
            <div className="no-drag flex just-center align-center control-btn cursor" onClick={changeLanguage}>
              {changeLang === '' ? '语言' : changeLang === 'zh_CN' ? '中' : '英'}
            </div>
            <div className="no-drag flex just-center align-center control-btn">
              <img src={GroupIcon} height={20} alt="" />
            </div>
            <div className="no-drag flex just-center align-center control-btn">
              <Dropdown
                trigger={['click']}
                overlayStyle={{ width: 200 }}
                overlay={
                  <Menu selectedKeys={[history.location.pathname]}>
                    <SubMenu key="system" className="no-drag" title={'11111111'}>
                      <Menu.Item onClick={() => goTo('/navigation/system/operationLog')}>444444444444444</Menu.Item>
                      <Menu.Item onClick={() => goTo('/navigation/system/operationLog')}>5555555555555555</Menu.Item>
                    </SubMenu>
                    <Menu.Item
                      key="logout"
                      className="no-drag"
                      title=""
                      onClick={() => {
                        Modal.confirm({
                          title: '你好',
                          centered: true,
                          content: <p className="ui-ta-c">9999999999</p>,
                          onOk: () => {
                            // logout({});
                            history.push('/login');
                          },
                          okText: '44444',
                          cancelText: '5555555'
                        });
                      }}
                    >
                      退出
                    </Menu.Item>
                  </Menu>
                }
              >
                <div className="flex align-center ui-h-100">
                  <img src={ListIcon} height={18} alt="" />
                  <DownOutlined style={{ fontSize: 8, marginLeft: 5 }} />
                </div>
              </Dropdown>
            </div>
          </div>
          <SystemController os={process.platform} showMaximize={showMaximize} />
        </div>
      </div>
      <style jsx>{`
        header {
          position: relative;
          height: 52px;
          overflow: hidden;
          background: #4e4e4e;
        }
        .control-group {
          display: flex;
          align-items: center;
          padding-right: 15px;
        }
        .header-right-options {
          padding-right: 29px;
        }
        .app-logo {
          width: 56px;
          min-width: 56px;
        }

        .control-btn {
          width: 46px;
          height: 100%;
        }
        .control-btn:hover {
          background: #000000 !important;
        }
      `}</style>
    </header>
  ));
};

export default Header;
