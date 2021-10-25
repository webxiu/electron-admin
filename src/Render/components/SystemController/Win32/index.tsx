/**
 * @Author yejiang1015
 * @Date 2020-06-19 22:38:43
 * @Last Modified by: yejiang1015
 * @Last Modified time: 2020-06-19 23:17:40
 * @Message Windows 系统
 */

import Close from './Close';
import Mini from './Mini';
import React from 'react';
import Toggle from './Toggle';

interface Props {
  /** 是否显示最大化 */
  showMaximize?: Boolean;
}

const Wrap: React.FC<Props> = (props) => {
  return (
    <>
      <Mini />
      {props.showMaximize ? <Toggle /> : null}
      <Close />
    </>
  );
};

export default Wrap;
