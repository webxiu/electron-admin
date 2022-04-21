import React, { useEffect } from 'react';

import createStretchableDom from './createStretchableDom';

const Stretch = () => {
  useEffect(() => {
    createStretchableDom({
      selector: '.green',
      points: ['bottom', 'right'],
      callBack: (width) => {
        console.log('width', width);
      }
    });
    createStretchableDom({
      selector: '.yellow',
      points: ['bottom', 'right'],
      callBack: (width) => {
        console.log('width', width);
      }
    });
  }, []);

  return (
    <div className="ui-w-100 ui-h-100 flex-col box">
      <div className="green top">top</div>
      <div className="middle flex ui-ov-a">
        <div className="yellow left">left</div>
        <div className="grey flex-1 right">right</div>
      </div>
      <div className="blue bottom">bottom</div>

      <style jsx>{`
        .red,
        .middle,
        .green,
        .blue,
        .yellow,
        .grey {
          position: relative;
          min-width: 300px;
          min-height: 100px;
        }
        .red {
          background: red;
        }
        .green {
          background: green;
        }
        .blue {
          background: blue;
        }
        .yellow {
          background: yellow;
        }
        .grey {
          background: grey;
        }
      `}</style>
    </div>
  );
};

export default Stretch;
