import React from 'react';

interface Props {
  /** svg名称或外部地址 http://www.test/abc.svg */
  iconName: string;
  /** 填充颜色(优先级高于样式颜色) */
  fill?: string;
  /** 类名 */
  className?: string;
  /** 样式 */
  style?: React.CSSProperties;
}

const SvgIcon: React.FC<Props> = (props) => {
  const { iconName, className = '', fill, style } = props;

  /** 是否为网络地址 */
  const isExternal = (path) => {
    return /^(https?:|http?:|mailto:|tel:)/.test(path);
  };

  return (
    <>
      {isExternal(iconName) ? (
        <div className={`svg-class svg-external ${className}`} style={{ WebkitMaskImage: `url(${iconName})`, ...style }} />
      ) : (
        <svg className={`svg-class ${className}`} aria-hidden="true" style={style}>
          <use xlinkHref={'#icon-' + iconName} fill={fill} />
        </svg>
      )}
      <style jsx global>{`
        .svg-class {
          width: 1em;
          height: 1em;
          vertical-align: -0.15em;
          fill: currentColor;
          overflow: hidden;
          font-size: inherit;
        }
        .svg-external {
          display: inline-block;
          background-color: currentColor;
          -webkit-mask-size: cover !important;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: 50% 50%;
        }
      `}</style>
    </>
  );
};

export default SvgIcon;
