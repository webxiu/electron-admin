declare module '*.css';
declare module '*.png';
declare module '*.ico';
declare module '*.js';
declare module '*.json';
declare module '*.node';
declare module '*.mp4';

/** θΏεε°ε */
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}
