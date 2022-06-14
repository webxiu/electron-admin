import 'antd/dist/antd.min.css';
import '@/Render/assets/css/style.less';
import '@/Render/assets/icons';
import '~/language/i18n';
import '@/Render/assets/language';

import App from '@/Render/routes';
import ReactDOM from 'react-dom';
import { remote } from 'electron';

ReactDOM.render(App, window.document.getElementById('root'), () => {
  remote.getCurrentWindow().show();
  if (!$$.isPro()) {
    remote.getCurrentWebContents().openDevTools();
  }
});
