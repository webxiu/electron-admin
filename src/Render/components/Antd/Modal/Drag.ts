class Drag {
  disX: number;
  disY: number;
  box: HTMLDivElement;
  wrap: HTMLDivElement;
  mousemove: (e: MouseEvent) => void;
  mouseup: () => void;
  constructor(ele: string, wrap: string) {
    this.disX = 0;
    this.disY = 0;
    this.box = document.querySelector(ele) as HTMLDivElement;
    this.wrap = document.querySelector(wrap) as HTMLDivElement;
    /** 鼠标事件的this指向元素,需绑定Drag的this */
    this.mousemove = this.move.bind(this);
    this.mouseup = this.up.bind(this);
  }
  init() {
    if (!this.wrap || !this.box) {
      return;
    }
    this.box.addEventListener('mousedown', this.down.bind(this));
    this.wrap.style.position = 'absolute';
    /** 鼠标形状 */
    // this.box.style.cssText += ';cursor:move;';
    /** 定位后居中显示 */
    this.wrap.style.left = (window.innerWidth - this.box.offsetWidth) / 2 + 'px';
  }
  down(ev: MouseEvent) {
    this.disX = ev.clientX - this.wrap.offsetLeft;
    this.disY = ev.clientY - this.wrap.offsetTop;
    document.addEventListener('mousemove', this.mousemove);
    document.addEventListener('mouseup', this.mouseup);
  }
  move(ev: MouseEvent) {
    this.wrap.style.left = ev.clientX - this.disX + 'px';
    this.wrap.style.top = ev.clientY - this.disY + 'px';
    /** 最大宽、高 */
    const maxHeight = window.innerHeight - this.wrap.offsetHeight;
    const maxWidth = window.innerWidth - this.wrap.offsetWidth;
    /** 防止拖出窗口 */
    this.wrap.offsetTop <= 0 && (this.wrap.style.top = '0px');
    this.wrap.offsetLeft <= 0 && (this.wrap.style.left = '0px');
    this.wrap.offsetTop >= maxHeight && (this.wrap.style.top = maxHeight + 'px');
    this.wrap.offsetLeft >= maxWidth && (this.wrap.style.left = maxWidth + 'px');
  }
  up() {
    document.removeEventListener('mousemove', this.mousemove);
    document.removeEventListener('mouseup', this.mouseup);
  }
}
export default Drag;
