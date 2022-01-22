import React, { useEffect, useState } from 'react';

import { Button } from 'antd';
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

  return (
    <div>
      <div className="box">
        <hr />
        <Button type="primary" onClick={() => push('/login')}>
          退出
        </Button>
      </div>
    </div>
  );
};

export default Wrap;
