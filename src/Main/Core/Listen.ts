import 'colors';

import Config from '~/config';
import Koa from 'koa';
import { ipcMain } from 'electron';
import os from 'os';

const net = require('net');

export const GetIPAddress = (type: 'IPv4' | 'IPv6') => {
  const interfaces = os.networkInterfaces();
  let address = '127.0.0.1';
  for (const key in interfaces) {
    for (const item of interfaces[key]) {
      if (item.family === type && key === 'en0') {
        address = item.address;
        break;
      }
    }
  }
  return address;
};

/**
 * 检测端口占用
 * @param port 端口号
 * @param callback 检测完成回调
 */
export const portIsOccupied = (port: number, callback = (err, port?) => {}) => {
  const server = net.createServer().listen(port);
  server.on('listening', () => {
    server.close();
    callback(null, port);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      portIsOccupied(port + 1, callback);
    } else {
      callback(err);
    }
  });
};

const OpenMainWindow = (port: number) => {
  const cPort = $$.isPro() ? port : port + 1;
  const href = `http://localhost:${cPort}`;
  ipcMain.emit('CreateBrowserWindow', { href });
};

export const Listen = async (app: Koa, callback?: Function) => {
  portIsOccupied(Config.port, (err, port) => {
    if (err !== null) return;
    const localTitle = `- Local:   `.rainbow;
    const localInner = `http://localhost:${port + Config.prefix}/`.blue;
    const networkTitle = `- Network: `.rainbow;
    const networkInner = `http://${GetIPAddress('IPv4')}:${port + Config.prefix}/`.blue;
    app.listen(port, () => {
      console.info(``);
      console.info(`serve running at:`.rainbow);
      console.info(localTitle + localInner);
      console.info(networkTitle + networkInner);
      OpenMainWindow(port);
      callback && typeof callback === 'function' && callback();
    });
  });
};
