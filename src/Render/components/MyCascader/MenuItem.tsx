import React from 'react';

const MenuItem = (props) => {
  return (
    <div className="menu-item">
      {props.children}
      <style jsx global>{`
        .menu-item {
          line-height: 50px;
          text-align: center;
        }
        .menu-item:hover {
            background: #f0f;
          }
        }
      `}</style>
    </div>
  );
};

export default MenuItem;
