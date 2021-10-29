import { Button, Checkbox, Form, Input, message, Radio, Space, Tabs } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import React, { useEffect, useRef, useState } from 'react';
import { getLoginInfo, removeLoginInfo, setLoginInfo, setUserInfo } from '@/Render/utils/auth';
import { login, login$$Request, login$$Response } from '@/Render/service';

import Header from '@/Render/layout/Navigation/Header';
import { errorMessage } from '@/Render/config/response.config';
import { setWindowSize } from '@/Render/config/window.config';
import { useHistory } from 'react-router';
import { useInject } from '@/Render/components/Hooks';
import { useTranslation } from 'react-i18next';

interface LoginType {
  username: string;
  password: string;
  remember: boolean;
}

const Wrap: React.FC = () => {
  const { minWidth, minHeight } = $$.AppInfo.window;
  setWindowSize(minWidth, minHeight, true);
  const { t } = useTranslation('login');
  const { push } = useHistory();
  const [form] = Form.useForm();
  const { Setting, Global } = useInject('Global', 'Setting');
  const loginInfo = getLoginInfo();
  const { username, password, remember } = loginInfo;
  const initialValues = { username, password, remember };
  const [initValules, setinitValules] = useState({ username, password, remember });
  const firstInput = useRef<boolean>(true);

  const onFinish = (values: LoginType) => {
    const { username, password, remember } = values;
    /** 设置接口服务地址 */
    Setting.SetSettings({ serverAddr: 'http://localhost:5002' });
    login({ username: username.trim(), password } as login$$Request)
      .then(({ data }) => {
        const res: login$$Response = data?.data;
        if (data.hasError) {
          message.error(data.errorDesc);
          return;
        }
        if (remember) {
          setLoginInfo(JSON.stringify(values));
        } else {
          removeLoginInfo();
        }
        setUserInfo(JSON.stringify(res));
        push('/home');
      })
      .catch((err: Error) => {
        push('/home');
        errorMessage(err);
        console.error('login_err:', err);
      });
  };

  const onUsernameChange = (e) => {
    const value = e.target.value;
    if (value !== initialValues.username && firstInput.current) {
      firstInput.current = false;
      form.setFieldsValue({ password: '', remember: false });
    }
  };

  return (
    <div className="flex-col ui-h-100">
      <Header showMaximize={false}>
        <div className="flex align-center ui-h-100">
          <span className="app-name">
            {$$.AppInfo.appName}v{$$.AppInfo.versions.appVersion}
          </span>
        </div>
      </Header>
      <div className="flex-1 start-page">
        <div className="login-wrap">
          <div className="login-box no-drag">
            <div className="login-title">
              {t('login')}&nbsp;
              {t('appName')}
            </div>
            <Form name="basic" initialValues={initialValues} form={form} className="login-form" onFinish={onFinish}>
              <Form.Item name="username" rules={[{ required: true, message: t('usernamePla') }]}>
                <Input
                  onChange={onUsernameChange}
                  className="form-input"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder={t('usernamePla')}
                />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: t('pwdPla') }]}>
                <Input className="form-input" prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder={t('pwdPla')} />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="form-checkbox">{t('rememberPwd')}</Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button type="primary" className="submit-btn" htmlType="submit">
                  {t('login')}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <style jsx global>{`
          .login-wrap {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .login-box {
            width: 360px;
            display: flex;
            align-items: center;
            flex-direction: column;
            box-sizing: border-box;
          }

          .login-title {
            color: #d4c2c2;
            font-size: 26px;
            text-align: center;
            padding: 20px 0;
          }
          .login-form {
            width: 100%;
          }
          .form-input {
            width: 100%;
            border-radius: 4px;
            height: 40px;
          }

          .submit-btn {
            width: 100%;
            height: 40px;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Wrap;
