import React, { useEffect, useState } from 'react';

interface Props {
  title: React.ReactNode;
}

const SubMenu: React.FC<Props> = (props) => {
  const [subShow, setSubShow] = useState<boolean>(false);

  useEffect(() => {
    console.log(`subShow`, subShow);
  }, [subShow]);
  const onMouseenter = () => {
    console.log(`enter`);
    setSubShow(true);
  };
  const onMouseLeave = () => {
    console.log(`leave`);
    setSubShow(false);
  };
  const onClick = () => {
    console.log(`onClick`, props);
    // setSubShow((x) => !x);
  };

  return (
    <div>
      <div className="sub-menu" onMouseEnter={onMouseenter} onMouseLeave={onMouseLeave} onClick={onClick}>
        <div className="title">
          {props.title}
          <span className="icon">&gt;</span>
        </div>
        <div className="sub-item" style={{ display: subShow ? 'block' : 'none' }}>
          {props.children}
        </div>
      </div>
      <style jsx global>{`
        .sub-menu {
          position: relative;
        }
        .sub-menu .title {
          line-height: 50px;
          text-align: center;
        }

        .sub-menu .title:hover {
          background: #f0f;
        }
        .sub-menu .title .icon {
          position: absolute;
          top: 0;
          right: 15px;
        }
        .sub-menu .sub-item {
          position: absolute;
          left: 100%;
          top: 0;
          width: 100%;
          background-color: #f98;
        }
      `}</style>
    </div>
  );
};

export default SubMenu;
