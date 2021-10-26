import enHeader from '@/Render/assets/langage/en/header';
import enLogin from '@/Render/assets/langage/en/login';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh_CNHeader from '@/Render/assets/langage/zh_CN/header';
import zh_CNLogin from '@/Render/assets/langage/zh_CN/login';

// 设置多个namespace
const resources = {
  zh_CN: {
    login: { ...zh_CNLogin },
    header: { ...zh_CNHeader }
  },
  en: {
    login: { ...enLogin },
    header: { ...enHeader }
  }
};

i18n.use(initReactI18next).init({
  // 引入资源文件
  resources: resources,
  // 默认语言，上述配置中的key，即: en/zh_CN
  fallbackLng: LANGUAGE,
  lng: LANGUAGE,
  // 支持语言 ['en', 'zh_CN']
  supportedLngs: Object.keys(resources),
  debug: false,
  interpolation: {
    // not needed for react as it escapes by default
    escapeValue: false
  }
});

export default i18n;
