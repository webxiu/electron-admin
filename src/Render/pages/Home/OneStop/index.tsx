import './index.less';

import { Button, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

import clipboardXh from '~/source/batch-clipboard-xh';
import { useHistory } from 'react-router';

const child_process = require('child_process');

const Wrap: React.FC = () => {
  useEffect(() => {
    call();
    const cpuNums = require('os').cpus().length;
    console.log(`cpuNums`, cpuNums);
  }, []);

  const { push } = useHistory();

  const call = async () => {
    const rootp = `C:`;
    const authPath = `C:\\Users\\Hailen\\Desktop\\other\\auth`;
    const openPath = `C:\\Users\\Hailen\\Desktop\\other\\open`;

    const command = `takeown /f ${rootp}`;
    // let code: number = 0;
    // try {
    //   child_process.exec(command);
    // } catch (error) {
    //   console.log(`error`, error);
    //   code = 1;
    // }
    // console.log(`目录权限: `, code, '磁盘:', rootp);

    try {
      await getAuth(authPath);
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const getAuth = async (dir: string) => {
    const command = `takeown /f ${dir} /r`;
    console.log(`command`, command);
    return new Promise<number>((resolve, reject) => {
      const accessApp = child_process.exec(command);
      accessApp.stdout.on('data', (data) => {
        console.log('data:', data?.toString());
      });
      accessApp.on('close', (code) => {
        console.log(`close18`, code);
        code === 0 ? resolve(code) : reject(code);
      });
    });
  };
  const onRead = () => {
    console.log('clipboardXh', clipboardXh.readFilePaths());
  };

  console.log('window', window);
  return (
    <div>
      <div className="box">
        <hr />
        <Button type="primary" onClick={onRead}>
          读取剪切板
        </Button>
        <Tag color="success">success</Tag>
        <Tag color="processing">processing</Tag>
        <Tag color="error">error</Tag>
        <Tag color="warning">warning</Tag>
        <Tag color="default">default</Tag>
        <hr />
        <Button onClick={() => push('/login')}>退出</Button>
        <div className="box">=====css-in-js样式====</div>
        <div className="test">=====less样式====</div>
        <div className="vars">=====var变量样式====</div>
        <div className="less-var">=====less变量样式====</div>
        <div className="test-img">=====less变量样式====</div>
      </div>
      <style jsx>{`
        .vars {
          background-color: var(--bdc);
        }
      `}</style>
    </div>
  );
};

export default Wrap;
