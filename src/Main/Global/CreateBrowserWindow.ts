/**
 * @Msg nativeImage.createFromPath png 或者 jpg
 */

import { BrowserWindow, IpcMainEvent, Menu, Tray, app, dialog, ipcMain, nativeImage, protocol } from 'electron';

import { AppEventNames } from '@/Types/EventTypes';
import path from 'path';

const pkg = require('~/package.json');
global.globalData = { showCloseModal: true };

ipcMain.once('CreateBrowserWindow', (event: IpcMainEvent & { href: string }) => {
  if (!event.href || typeof event.href !== 'string') {
    dialog.showErrorBox('创建新窗口错误', `新窗口地址不合法、 ${event.href}`);
    return;
  }
  const faviconProPath = `resources/app.asar.unpacked/public/assets/favicon/favicon.png`;
  const faviconDevPath = `public/assets/favicon/favicon.png`;
  const faviconPath = $$.JoinDirWithRoot($$.isPro() ? faviconProPath : faviconDevPath);
  const NewBrowserWindowOptions = { ...pkg.window, icon: nativeImage.createFromPath(faviconPath) };
  const _BrowserWindow = new BrowserWindow(NewBrowserWindowOptions);
  _BrowserWindow.loadURL(event.href);
  Reflect.set(global, 'CreateBrowserWindow', _BrowserWindow);
  //===========自定义file:///协议的解析=======================
  protocol.interceptFileProtocol(
    'file',
    (req, callback) => {
      const url = req.url.substr(8);
      callback(decodeURI(url));
    },
    (error) => {
      if (error) {
        console.error('Failed to register protocol');
      }
    }
  );
  /**
   * @platform darwin Mac 平台关闭按钮不退出
   * @Msg 创建窗口后监听窗口关闭，区分平台
   * 关闭窗口事件，如果是quit退出，则清除全局主窗口缓存实例， 否则隐藏窗口
   */
  if (process.platform === 'darwin' || process.platform === 'linux') {
    Reflect.set(global, 'willQuitApp', false);
    (Reflect.get(global, 'CreateBrowserWindow') as BrowserWindow).on('close', (e) => {
      if (Reflect.get(global, 'willQuitApp')) {
        Reflect.deleteProperty(global, 'CreateBrowserWindow');
      } else {
        e.preventDefault();
        (Reflect.get(global, 'CreateBrowserWindow') as BrowserWindow).hide();
      }
    });
    app.on('activate', () => (Reflect.get(global, 'CreateBrowserWindow') as BrowserWindow).show());

    app.on('before-quit', () => Reflect.set(global, 'willQuitApp', true));
  }
  /**
   * @platform win32 平台关闭按钮不退出，系统托盘
   * @Msg 创建窗口后监听窗口关闭，区分平台
   * 关闭窗口事件，如果是quit退出，则清除全局主窗口缓存实例， 否则隐藏窗口
   */
  if (process.platform === 'win32') {
    /** 窗口关闭提醒 : */
    _BrowserWindow.on('close', (e) => {
      if (global.globalData.showCloseModal) {
        e.preventDefault();
        _BrowserWindow.show();
        _BrowserWindow.webContents.send(AppEventNames.WINDOW_CLOSE);
      }
    });
  }

  //系统托盘右键菜单 https://segmentfault.com/q/1010000012390487
  const trayMenuTemplate = [
    {
      label: '设置app',
      click: function () {} //打开相应页面
    },
    {
      label: '意见反馈app',
      click: function () {}
    },
    {
      label: '帮助app',
      click: function () {}
    },
    {
      label: '关于app',
      click: function () {}
    },
    {
      label: '退出app',
      click: function () {
        //ipc.send('close-main-window');
        app.quit();
      }
    }
  ];

  //系统托盘图标目录
  const trayIcon = path.join(__dirname, '../public/assets/favicon/ico');

  //图标的上下文菜单
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  //创建系统托盘图标
  const appTray = new Tray(path.join(trayIcon, 'favicon.ico'));

  //设置此托盘图标的悬停提示内容
  appTray.setToolTip('海阔天空');

  //设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu);

  //单点击 1.主窗口显示隐藏切换 2.清除闪烁
  appTray.on('click', function () {
    _BrowserWindow.show();
  });
});
