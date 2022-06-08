import atlas_sign from '@/Render/assets/img/wave/atlas_sign.png';
import wave_copy from '@/Render/assets/img/wave/wave_copy.png';
import wave_cut from '@/Render/assets/img/wave/wave_cut.png';
import wave_delete from '@/Render/assets/img/wave/wave_delete.png';
import wave_paste from '@/Render/assets/img/wave/wave_paste.png';
import wave_save from '@/Render/assets/img/wave/wave_save.png';
import wave_undo from '@/Render/assets/img/wave/wave_undo.png';

export type ShortcutKey =
  | 'wave_save'
  | 'wave_cut'
  | 'wave_copy'
  | 'wave_paste'
  | 'wave_delete'
  | 'wave_undo'
  | 'wave_addSign'
  | 'wave_clear'
  | 'select_all'
  | 'wave_right'
  | 'wave_left'
  | 'wave_space';

export interface ShortcutKeyItemType {
  /** 快捷键名称 */
  name: string;
  /** 事件注册key值 */
  key: string;
  /** 图谱接收快捷键类型 */
  type: ShortcutKey;
  /** 缩写编号 */
  code: string;
  /** 图标 */
  icon: string;
  /** 是否显示图标 */
  show: boolean;
}

/** 注册快捷键(自定义添加) */
export const shortcutKeyList: ShortcutKeyItemType[] = [
  { name: '复制', key: 'ctrl+c', type: 'wave_copy', code: '(C)', icon: wave_copy, show: true },
  { name: '剪切', key: 'ctrl+x', type: 'wave_cut', code: '(X)', icon: wave_cut, show: true },
  { name: '粘贴', key: 'ctrl+v', type: 'wave_paste', code: '(V)', icon: wave_paste, show: true },
  { name: '删除', key: 'del', type: 'wave_delete', code: '(D)', icon: wave_delete, show: true },
  { name: '撤销', key: 'ctrl+z', type: 'wave_undo', code: '(Z)', icon: wave_undo, show: true },
  { name: '标注', key: 'ctrl+n', type: 'wave_addSign', code: '(N)', icon: atlas_sign, show: true },
  { name: '保存', key: 'ctrl+s', type: 'wave_save', code: '(S)', icon: wave_save, show: true },
  { name: '清空', key: 'ctrl+del', type: 'wave_clear', code: '', icon: '', show: false }
];
/** 注册快捷键(默认添加) */
export const shortcutKeyDefaultList: ShortcutKeyItemType[] = [
  { name: '全选', key: 'ctrl+a', type: 'select_all', code: '(A)', icon: '', show: false },
  { name: '右移', key: 'right', type: 'wave_right', code: '', icon: '', show: false },
  { name: '左移', key: 'left', type: 'wave_left', code: '', icon: '', show: false },
  { name: '空格', key: 'space', type: 'wave_space', code: '', icon: '', show: false }
];

/** 图谱右键菜单 */
export const contextMenuList: ShortcutKeyItemType[] = [
  { name: '标注', key: 'ctrl+n', type: 'addSign', code: '(N)', icon: atlas_sign, show: true },
  { name: '撤销', key: 'ctrl+z', type: 'undo', code: '(Z)', icon: wave_undo, show: true },
  { name: '剪切', key: 'ctrl+x', type: 'cut', code: '(X)', icon: wave_cut, show: true },
  { name: '复制', key: 'ctrl+c', type: 'copy', code: '(C)', icon: wave_copy, show: true },
  { name: '粘贴', key: 'ctrl+v', type: 'paste', code: '(V)', icon: wave_paste, show: true },
  { name: '全选', key: 'ctrl+a', type: 'select_all', code: '(A)', icon: '', show: false }
];
