import React, { useEffect } from 'react';

import Mousetrap from 'mousetrap';
import { ShortcutKeyItemType } from '@/Render/config/wave.config';

interface Props {
  shortcutKeyList: ShortcutKeyItemType[];
  onWaveHandle: (type: string) => void;
}
const EditMenu: React.FC<Props> = (props) => {
  const { shortcutKeyList, onWaveHandle } = props;

  useEffect(() => {
    shortcutKeyList.forEach((s) => {
      Mousetrap.bind(s.key, (e) => onWaveHandle(s.type));
    });
    return () => {
      shortcutKeyList.forEach((s) => Mousetrap.unbind(s.key));
    };
  }, [shortcutKeyList, onWaveHandle]);

  return (
    <div style={{ paddingBottom: '10px' }}>
      <div className="flex just-between align-center wave-icon-list">
        <div className="flex align-center">
          <div className="label-colon mr10">工具区</div>
          <div className="action-control">
            {shortcutKeyList.map((item) =>
              item.show ? (
                <img key={item.type} src={item.icon} className="control-icon" title={item.name} alt={item.name} onClick={() => onWaveHandle(item.type)} />
              ) : null
            )}
          </div>
        </div>
        {props.children}
      </div>
      <style jsx global>{`
        .wave-icon-list {
          background: #081b3a;
          border: 1px solid rgba(0, 158, 233, 0.3);
          padding: 5px;
        }
        .control-icon {
          margin-right: 20px;
          color: #009ee9;
          font-size: 16px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default EditMenu;
