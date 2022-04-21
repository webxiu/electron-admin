type DomSelector = string;
type Border = 'right' | 'bottom' | 'corner';
type CallBack = (width: number, height: number) => void;

type Params = {
  selector: DomSelector;
  callBack: CallBack;
  points: Border[];
  borderSize?: number;
};

export default function createStretchableDom(params: Params) {
  const { selector, callBack, points = ['right'], borderSize = 4 } = params;
  const oBox = document.querySelector(selector) as HTMLElement;
  if (!oBox) return;

  points.forEach((pos) => {
    const stretchDom = document.createElement('div');
    stretchDom.className = pos;
    stretchDom.style.borderRadius = '5px';
    stretchDom.style.position = 'absolute';
    // stretchDom.style.background = 'rgba(144, 142, 255, 0.5)';
    setStyle(stretchDom, pos, borderSize + 'px');
    oBox.appendChild(stretchDom);
    const rect = stretchDom.getBoundingClientRect();
    if (rect.left + borderSize === window.innerWidth) {
      oBox.removeChild(stretchDom);
    }
  });
  oBox.onmousedown = (e: MouseEvent) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    const className = target.className;
    const x = e.clientX;
    const y = e.clientY;
    const oBoxW = oBox.offsetWidth;
    const oBoxH = oBox.offsetHeight;

    document.onmousemove = function (e) {
      const xx = e.clientX;
      const yy = e.clientY;
      const newWidth = oBoxW + xx - x;
      const newHeight = oBoxH + yy - y;
      if (className === 'right') {
        oBox.style.width = newWidth + 'px';
      } else if (className === 'bottom') {
        oBox.style.height = newHeight + 'px';
      } else if (className === 'corner') {
        oBox.style.width = newWidth + 'px';
        oBox.style.height = newHeight + 'px';
      }
      callBack(newWidth, newHeight);
      return false;
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

const setStyle = (stretchDom: HTMLDivElement, pos: Border, size) => {
  if (pos === 'bottom') {
    stretchDom.style.left = '0px';
    stretchDom.style.bottom = '0px';
    stretchDom.style.height = size;
    stretchDom.style.width = '100%';
    stretchDom.style.cursor = 'ns-resize';
    stretchDom.style.background = '#f0f';
  } else if (pos === 'right') {
    stretchDom.style.top = '0px';
    stretchDom.style.right = '0px';
    stretchDom.style.width = size;
    stretchDom.style.height = '100%';
    stretchDom.style.cursor = 'ew-resize';
    stretchDom.style.background = '#00f';
  } else if (pos === 'corner') {
    stretchDom.style.bottom = '0px';
    stretchDom.style.right = '0px';
    stretchDom.style.width = size;
    stretchDom.style.height = size;
    stretchDom.style.cursor = 'nwse-resize';
    stretchDom.style.background = '#f00';
    stretchDom.style.borderRadius = '0px';
  }
};
