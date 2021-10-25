import Desc_icon from '@/Render/assets/img/icons/menu_icon1.png';
import React from 'react';
import { menuList } from '@/Render/config/menu.config';
import { useHistory } from 'react-router';

const Wrap: React.FC = () => {
  const { push } = useHistory();
  return (
    <div className="start-wrap">
      <div className="welcome">
        <span className="use">欢迎使用</span> {$$.AppInfo.appName}
      </div>
      <div className="tool-type">选择您所需的工具类型：</div>
      <ul className="tool-list flex just-between">
        {menuList.map((item) => (
          <li key={item.key} className="tool-item flex-col just-between align-center" onClick={() => push(item.path)}>
            <span className="title">{item.title}</span>
            <div className="tool-info">
              <span className="tool-desc">{item.discription}</span>
              <img width={16} src={Desc_icon} alt="" />
            </div>
            <img width="70" className="start-icon align-self-end" src={item.img} alt="" />
          </li>
        ))}
      </ul>
      <style jsx>{`
        .start-wrap .welcome {
          font-family: SourceHanSans-Normal;
          font-size: 24px;
          color: #bbbbbb;
          line-height: 36px;
          font-weight: 400;
        }
        .start-wrap .welcome .use {
          font-family: SourceHanSans-;
          font-weight: 200;
        }
        .start-wrap .tool-type {
          margin-top: 55px;
          font-family: SourceHanSans-Normal;
          font-size: 16px;
          color: #bbbbbb;
          font-weight: 400;
        }
        .start-wrap .tool-list {
          padding-right: 50px;
          margin-top: 20px;
        }
        .start-wrap .tool-item {
          width: 152px;
          height: 184px;
          background: #262626;
          border: 1px solid #0253db;
          border-radius: 4px;
          padding: 0 15px;
        }

        .start-wrap .title {
          font-family: SourceHanSans-Normal;
          font-size: 18px;
          color: #ffffff;
          font-weight: 400;
          padding-top: 24px;
        }
        .start-wrap .tool-info {
          flex: 1;
          position: relative;
          display: none;
        }
        .start-wrap .tool-desc {
          font-size: 12px;
          color: #ffffff;
          text-align: justify;
          opacity: 0.45;
          margin-top: 20px;
          line-height: 18px;
          font-weight: 400;
          font-family: SourceHanSans-Normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
        .start-wrap .tool-info img {
          position: absolute;
          bottom: 16px;
          right: 0px;
        }

        .start-wrap .tool-item:hover {
          cursor: pointer;
        }
        .start-wrap .tool-item:hover .tool-info {
          display: block;
          transition: all 1s linear;
        }

        .start-wrap .tool-item:hover .start-icon {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Wrap;
