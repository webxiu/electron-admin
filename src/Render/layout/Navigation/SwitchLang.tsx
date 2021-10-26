import React, { useEffect, useState } from 'react';

import i18n from '@/Render/routes/i18n';

const LANG_KEY = '__LANG_KEY__';
const lang = {
  en: '英',
  zh_CN: '中',
  default: '语言'
};

export const Wrap: React.FC = (props) => {
  const [changeLang, setChangeLang] = useState<string>('default');

  useEffect(() => {
    const lang = getLanguage();
    if (lang) {
      setLanguage(lang);
      setChangeLang(lang);
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage(changeLang);
    }
  }, [changeLang]);

  /** 获取语言 */
  const getLanguage = () => {
    return sessionStorage.getItem(LANG_KEY) || '';
  };

  /** 设置语言 */
  const setLanguage = (lang: string) => {
    sessionStorage.setItem(LANG_KEY, lang);
  };

  /** 切换语言 */
  const changeLanguage = () => {
    setChangeLang((lang) => {
      const l = lang === 'zh_CN' ? 'en' : 'zh_CN';
      setLanguage(l);
      return l;
    });
  };
  return (
    <span className="cursor" onClick={changeLanguage}>
      {lang[changeLang]}
    </span>
  );
};

export default Wrap;
