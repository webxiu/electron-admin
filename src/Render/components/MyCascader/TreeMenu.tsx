import React from 'react';

const TreeMenu = (props) => {
  return (
    <div className="tree-menu">
      {props.children}
      <style jsx global>{`
        .tree-menu {
          width: 160px;
        }
        .tree-menu .xh-menu {
          background: #f60;
          padding: 10px 0;
          position: relative;
        }
        .tree-menu .xh-menu:hover {
          background: #f0f;
        }
        .tree-menu .xh-menu .xh-sub-menu {
          position: absolute;
          left: 100%;
          top: 0;
          width: 160px;
        }
        .tree-menu .xh-menu .xh-sub-menu .xh-sub-menu_item {
          padding: 10px 0;
          background: #f0f;
        }
        .tree-menu .xh-menu .xh-sub-menu .xh-sub-menu_item:hover {
          background: #f60;
        }
      `}</style>
    </div>
  );
};

export default TreeMenu;
