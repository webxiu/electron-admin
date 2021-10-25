/* eslint-disable no-var */
/**
 * @Author yejiang1015
 * @Date 2020-11-16 17:23:06
 * @Last Modified by: yejiang1015
 * @Last Modified time: 2020-12-03 12:14:26
 * @Message https://threejs.org/examples/webgl_points_waves.html
 */

import React, { useEffect, useRef, useState } from 'react';

interface Props {
  path: string;
  poster?: string;
  children: React.ReactNode;
}
export default (props: Props) => {
  const VideoREF = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!VideoREF || !VideoREF.current) return;
    VideoREF.current.playbackRate = 0.7;
    VideoREF.current.onload = () => {};
    VideoREF.current.onloadedmetadata = () => {};
  }, [VideoREF]);
  return (
    <section className="ui-p-r ui-w-100 ui-h-100 drag ui-ov-h">
      <div className="three">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video ref={VideoREF} poster={props.poster} object-fit="cover" autoPlay loop width="100%" preload="metadata" src={props.path}></video>
      </div>
      <div className="inner">{props.children}</div>
      <style jsx>{`
        .three,
        .inner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
        }
        .three {
          z-index: 1;
        }
        .inner {
          z-index: 2;
          background: transparent;
        }
      `}</style>
    </section>
  );
};
